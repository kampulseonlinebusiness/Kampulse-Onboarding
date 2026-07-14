import React, { useState } from "react";
import { Link, useParams } from "wouter";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { 
  useGetAdminApplication, 
  useUpdateApplicationStatus, 
  useAddApplicationNote, 
  getGetAdminApplicationQueryKey 
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, User, FileText, FileSignature, Users, MessageSquare, Loader2, Download, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export function AdminApplicationDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: app, isLoading } = useGetAdminApplication(id, {
    query: {
      enabled: !!id,
      queryKey: getGetAdminApplicationQueryKey(id)
    }
  });

  const updateStatus = useUpdateApplicationStatus();
  const addNote = useAddApplicationNote();

  const [noteContent, setNoteContent] = useState("");

  const handleStatusChange = (newStatus: string) => {
    updateStatus.mutate({
      id,
      data: { status: newStatus as any }
    }, {
      onSuccess: (data) => {
        toast({ title: "Status Updated", description: `Application moved to ${newStatus.replace('_', ' ')}` });
        queryClient.invalidateQueries({ queryKey: getGetAdminApplicationQueryKey(id) });
      },
      onError: (err: any) => {
        toast({ title: "Update Failed", description: err.message, variant: "destructive" });
      }
    });
  };

  const handleAddNote = () => {
    if (!noteContent.trim()) return;
    addNote.mutate({
      id,
      data: { content: noteContent }
    }, {
      onSuccess: () => {
        setNoteContent("");
        toast({ title: "Note Added", description: "Your internal note was saved." });
        queryClient.invalidateQueries({ queryKey: getGetAdminApplicationQueryKey(id) });
      }
    });
  };

  const generatePdf = async () => {
    // Generate PDF endpoint is assumed to be accessible via fetch
    try {
      const res = await fetch(`/api/admin/applications/${id}/pdf`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('kampulse_auth') ? JSON.parse(localStorage.getItem('kampulse_auth')!).accessToken : ''}`
        }
      });
      const data = await res.json();
      if (data.pdfUrl) {
        window.open(data.pdfUrl, '_blank');
      } else {
        toast({ title: "Error", description: "PDF generation failed.", variant: "destructive" });
      }
    } catch (e) {
      toast({ title: "Error", description: "Failed to connect to PDF service.", variant: "destructive" });
    }
  };

  if (isLoading || !app) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <Link href="/admin/applications" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Applications
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">{app.personalInfo?.fullName || "Application Profile"}</h1>
            <Badge className="capitalize">{app.status.replace('_', ' ')}</Badge>
          </div>
          <p className="text-muted-foreground flex items-center gap-4">
            <span>{app.jobTitle}</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
            <span>Applied {format(new Date(app.createdAt), 'MMM d, yyyy')}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={generatePdf} className="gap-2">
            <Download className="w-4 h-4" /> Export PDF
          </Button>
          <div className="w-40">
            <Select value={app.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="bg-card">
                <SelectValue placeholder="Update Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent overflow-x-auto">
              <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shadow-none bg-transparent px-4">Overview</TabsTrigger>
              <TabsTrigger value="personal" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shadow-none bg-transparent px-4">Personal Info</TabsTrigger>
              <TabsTrigger value="documents" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shadow-none bg-transparent px-4">Documents</TabsTrigger>
              <TabsTrigger value="guarantor" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shadow-none bg-transparent px-4">Guarantor</TabsTrigger>
              <TabsTrigger value="agreement" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shadow-none bg-transparent px-4">Agreement</TabsTrigger>
            </TabsList>

            <div className="pt-6">
              <TabsContent value="overview">
                <Card className="shadow-sm mb-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Application Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Expected Start Date</p>
                        <p>{app.expectedStartDate || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Source</p>
                        <p>{app.applicationSource || "Not specified"}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm font-medium text-muted-foreground">Cover Letter</p>
                        <div className="p-4 bg-muted/20 rounded-md mt-1 whitespace-pre-wrap text-sm">
                          {app.coverLetter || "No cover letter provided."}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-card border rounded-lg p-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 text-blue-700 rounded-lg"><FileText className="w-5 h-5"/></div>
                      <div>
                        <div className="font-medium">Documents</div>
                        <div className="text-sm text-muted-foreground">{app.documents?.length || 0} uploaded</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-card border rounded-lg p-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 text-green-700 rounded-lg"><FileSignature className="w-5 h-5"/></div>
                      <div>
                        <div className="font-medium">Agreement</div>
                        <div className="text-sm text-muted-foreground">{app.agreementAccepted ? "Signed" : "Pending"}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="personal">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-x-6 gap-y-6">
                      <div className="space-y-4">
                        <div><p className="text-sm text-muted-foreground">Full Name</p><p className="font-medium">{app.personalInfo?.fullName}</p></div>
                        <div><p className="text-sm text-muted-foreground">Email</p><p className="font-medium">{app.personalInfo?.email}</p></div>
                        <div><p className="text-sm text-muted-foreground">Phone</p><p className="font-medium">{app.personalInfo?.phone}</p></div>
                        <div><p className="text-sm text-muted-foreground">Date of Birth</p><p className="font-medium">{app.personalInfo?.dateOfBirth}</p></div>
                        <div><p className="text-sm text-muted-foreground">Gender</p><p className="font-medium capitalize">{app.personalInfo?.gender}</p></div>
                        <div><p className="text-sm text-muted-foreground">Marital Status</p><p className="font-medium capitalize">{app.personalInfo?.maritalStatus}</p></div>
                      </div>
                      <div className="space-y-4">
                        <div><p className="text-sm text-muted-foreground">Address</p><p className="font-medium">{app.personalInfo?.address}</p></div>
                        <div><p className="text-sm text-muted-foreground">Nationality</p><p className="font-medium">{app.personalInfo?.nationality}</p></div>
                        <div><p className="text-sm text-muted-foreground">State of Origin</p><p className="font-medium">{app.personalInfo?.stateOfOrigin}</p></div>
                        <div><p className="text-sm text-muted-foreground">LGA</p><p className="font-medium">{app.personalInfo?.lga}</p></div>
                        <div>
                          <p className="text-sm text-muted-foreground">Computer Literacy</p>
                          <p className="font-medium capitalize">
                            {app.personalInfo?.computerLiteracy === "proficient" ? "Yes — Proficient"
                              : app.personalInfo?.computerLiteracy === "basic" ? "Yes — Basic Knowledge"
                              : app.personalInfo?.computerLiteracy === "none" ? "No — Not computer literate"
                              : "Not specified"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-bold mb-4 flex items-center gap-2"><User className="w-4 h-4"/> Next of Kin</h4>
                        <div className="space-y-3">
                          <div><p className="text-sm text-muted-foreground">Name</p><p className="font-medium">{app.personalInfo?.nextOfKinName}</p></div>
                          <div><p className="text-sm text-muted-foreground">Relationship</p><p className="font-medium">{app.personalInfo?.nextOfKinRelationship}</p></div>
                          <div><p className="text-sm text-muted-foreground">Phone</p><p className="font-medium">{app.personalInfo?.nextOfKinPhone}</p></div>
                          <div><p className="text-sm text-muted-foreground">Address</p><p className="font-medium">{app.personalInfo?.nextOfKinAddress}</p></div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold mb-4 flex items-center gap-2"><User className="w-4 h-4 text-red-500"/> Emergency Contact</h4>
                        <div className="space-y-3">
                          <div><p className="text-sm text-muted-foreground">Name</p><p className="font-medium">{app.personalInfo?.emergencyContactName}</p></div>
                          <div><p className="text-sm text-muted-foreground">Relationship</p><p className="font-medium">{app.personalInfo?.emergencyContactRelationship}</p></div>
                          <div><p className="text-sm text-muted-foreground">Phone</p><p className="font-medium">{app.personalInfo?.emergencyContactPhone}</p></div>
                          <div><p className="text-sm text-muted-foreground">Address</p><p className="font-medium">{app.personalInfo?.emergencyContactAddress}</p></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Uploaded Documents</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {app.documents && app.documents.length > 0 ? (
                      app.documents.map(doc => (
                        <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/10 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-medium capitalize">{doc.fileType.replace(/_/g, ' ')}</p>
                              <p className="text-sm text-muted-foreground">{doc.fileName}</p>
                            </div>
                          </div>
                          <a href={doc.fileUrl} target="_blank" rel="noreferrer">
                            <Button variant="outline" size="sm" className="gap-2">
                              <ExternalLink className="w-4 h-4"/> View
                            </Button>
                          </a>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                        No documents uploaded yet.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="guarantor">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Guarantor Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-x-6 gap-y-6">
                      <div className="space-y-4">
                        <div><p className="text-sm text-muted-foreground">Full Name</p><p className="font-medium">{app.guarantorInfo?.guarantorFullName}</p></div>
                        <div><p className="text-sm text-muted-foreground">Relationship</p><p className="font-medium">{app.guarantorInfo?.guarantorRelationship}</p></div>
                        <div><p className="text-sm text-muted-foreground">Years Known</p><p className="font-medium">{app.guarantorInfo?.guarantorYearsKnown}</p></div>
                        <div><p className="text-sm text-muted-foreground">Phone</p><p className="font-medium">{app.guarantorInfo?.guarantorPhone}</p></div>
                        <div><p className="text-sm text-muted-foreground">Email</p><p className="font-medium">{app.guarantorInfo?.guarantorEmail}</p></div>
                      </div>
                      <div className="space-y-4">
                        <div><p className="text-sm text-muted-foreground">Occupation</p><p className="font-medium">{app.guarantorInfo?.guarantorOccupation}</p></div>
                        <div><p className="text-sm text-muted-foreground">Place of Work</p><p className="font-medium">{app.guarantorInfo?.guarantorPlaceOfWork}</p></div>
                        <div><p className="text-sm text-muted-foreground">Address</p><p className="font-medium">{app.guarantorInfo?.guarantorAddress}</p></div>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-bold mb-4 flex items-center gap-2"><User className="w-4 h-4"/> Identification</h4>
                        <div className="space-y-3">
                          <div><p className="text-sm text-muted-foreground">ID Type</p><p className="font-medium">{app.guarantorInfo?.guarantorIdType}</p></div>
                          <div><p className="text-sm text-muted-foreground">ID Number</p><p className="font-medium">{app.guarantorInfo?.guarantorIdNumber}</p></div>
                          <div><p className="text-sm text-muted-foreground">Issue Date</p><p className="font-medium">{app.guarantorInfo?.guarantorIdIssueDate}</p></div>
                          <div><p className="text-sm text-muted-foreground">Expiry Date</p><p className="font-medium">{app.guarantorInfo?.guarantorIdExpiryDate}</p></div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold mb-4 flex items-center gap-2"><Users className="w-4 h-4"/> Witness</h4>
                        <div className="space-y-3">
                          <div><p className="text-sm text-muted-foreground">Name</p><p className="font-medium">{app.guarantorInfo?.witnessName}</p></div>
                          <div><p className="text-sm text-muted-foreground">Phone</p><p className="font-medium">{app.guarantorInfo?.witnessPhone}</p></div>
                          <div><p className="text-sm text-muted-foreground">Address</p><p className="font-medium">{app.guarantorInfo?.witnessAddress}</p></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="agreement">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Employment Agreement</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {app.agreementAccepted ? (
                      <>
                        <div className="bg-green-50 text-green-800 p-4 rounded-lg flex items-center gap-3">
                          <CheckCircle className="w-6 h-6 shrink-0" />
                          <div>
                            <p className="font-medium">Agreement Accepted & Signed</p>
                            <p className="text-sm">Signed on {app.agreementSignedAt ? format(new Date(app.agreementSignedAt), 'MMM d, yyyy h:mm a') : 'Unknown Date'}</p>
                          </div>
                        </div>
                        {app.signatureData && (
                          <div className="border rounded-lg p-6 bg-white inline-block">
                            <img src={app.signatureData} alt="Applicant Signature" className="max-h-32" />
                            <div className="border-t mt-4 pt-2 text-center text-sm text-muted-foreground font-medium">
                              {app.personalInfo?.fullName}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                        Agreement not signed yet.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Right Sidebar - Notes & Timeline */}
        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="bg-muted/30 border-b pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5" /> Internal Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {app.notes && app.notes.length > 0 ? (
                  app.notes.map(note => (
                    <div key={note.id} className="bg-muted/30 p-3 rounded-lg border">
                      <p className="text-sm mb-2">{note.content}</p>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{note.createdBy || 'Admin'}</span>
                        <span>{format(new Date(note.createdAt), 'MMM d, h:mm a')}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No internal notes yet.</p>
                )}
              </div>
              <div className="pt-4 border-t space-y-3">
                <Textarea 
                  placeholder="Add a private note about this applicant..." 
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button onClick={handleAddNote} disabled={!noteContent.trim() || addNote.isPending} className="w-full">
                  {addNote.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null} Add Note
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

// Ensure CheckCircle is imported correctly
import { CheckCircle } from "lucide-react";
