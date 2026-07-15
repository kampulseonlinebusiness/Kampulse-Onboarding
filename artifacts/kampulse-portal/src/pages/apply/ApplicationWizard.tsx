import React, { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "wouter";
import { PublicLayout } from "../../components/layout/PublicLayout";
import { 
  useResumeApplication, 
  useSavePersonalInfo, 
  useSaveGuarantorInfo, 
  useSaveAgreement, 
  useSubmitApplication,
  getResumeApplicationQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle2, UploadCloud, File, X, ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SignatureCanvas from 'react-signature-canvas';

const uploadFile = async (token: string, file: File, fileType: string) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`/api/uploads/${token}?fileType=${fileType}`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || err.error || "Upload failed");
  }
  return res.json();
};

export function ApplicationWizard() {
  const params = useParams();
  const token = params.token || "";
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [currentStep, setCurrentStep] = useState(1);

  const { data: app, isLoading, isError } = useResumeApplication(token, {
    query: {
      enabled: !!token,
      queryKey: getResumeApplicationQueryKey(token)
    }
  });

  useEffect(() => {
    if (app && app.status !== "draft" && app.status !== "pending") {
      // If already submitted
      if (app.status === "under_review" || app.status === "approved" || app.status === "rejected") {
        toast({ title: "Application already submitted", description: "You cannot edit a submitted application." });
        setLocation("/apply/success");
      }
    }
  }, [app, setLocation, toast]);

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </PublicLayout>
    );
  }

  if (isError || !app) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Application Not Found</h2>
          <p className="text-muted-foreground mb-8">The link may be invalid or expired.</p>
        </div>
      </PublicLayout>
    );
  }

  const steps = [
    "Job Application",
    "Personal Info",
    "Documents Upload",
    "Guarantor Info",
    "Employment Agreement",
    "Review & Submit"
  ];

  return (
    <PublicLayout>
      <div className="bg-muted/30 py-8 border-b">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Application for {app.jobTitle}</h1>
          
          {/* Progress Bar */}
          <div className="relative">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-muted">
              <div style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500"></div>
            </div>
            <div className="hidden md:flex justify-between w-full text-xs font-medium text-muted-foreground">
              {steps.map((step, idx) => (
                <div key={idx} className={`text-center ${currentStep >= idx + 1 ? 'text-primary' : ''}`}>
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl min-h-[50vh]">
        {currentStep === 1 && <Step1JobApp app={app} onNext={() => setCurrentStep(2)} />}
        {currentStep === 2 && <Step2PersonalInfo app={app} onNext={() => setCurrentStep(3)} onBack={() => setCurrentStep(1)} token={token} />}
        {currentStep === 3 && <Step3Documents app={app} onNext={() => setCurrentStep(4)} onBack={() => setCurrentStep(2)} token={token} />}
        {currentStep === 4 && <Step4Guarantor app={app} onNext={() => setCurrentStep(5)} onBack={() => setCurrentStep(3)} token={token} />}
        {currentStep === 5 && <Step5Agreement app={app} onNext={() => setCurrentStep(6)} onBack={() => setCurrentStep(4)} token={token} />}
        {currentStep === 6 && <Step6Review app={app} onBack={() => setCurrentStep(5)} token={token} setStep={setCurrentStep} />}
      </div>
    </PublicLayout>
  );
}

// ---------------------------------------------------------
// STEP 1: Job Application Info
// ---------------------------------------------------------
function Step1JobApp({ app, onNext }: { app: any; onNext: () => void }) {
  return (
    <div className="bg-card border shadow-sm rounded-xl p-6 md:p-8 animate-in fade-in zoom-in-95 duration-300">
      <h2 className="text-2xl font-bold mb-6">Job Application Details</h2>
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Position</label>
          <div className="mt-1 p-3 bg-muted/50 rounded-md border font-medium">{app.jobTitle}</div>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Expected Start Date</label>
          <div className="mt-1 p-3 bg-muted/50 rounded-md border">{app.expectedStartDate}</div>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Application Source</label>
          <div className="mt-1 p-3 bg-muted/50 rounded-md border">{app.applicationSource}</div>
        </div>
      </div>
      <div className="mb-8">
        <label className="text-sm font-medium text-muted-foreground">Cover Letter</label>
        <div className="mt-1 p-4 bg-muted/50 rounded-md border whitespace-pre-wrap text-sm">{app.coverLetter}</div>
      </div>
      
      <div className="flex justify-end pt-6 border-t">
        <Button onClick={onNext} className="gap-2">Next Step <ArrowRight className="w-4 h-4" /></Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// STEP 2: Personal Information
// ---------------------------------------------------------
const personalInfoSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other"]),
  nationality: z.string().min(1, "Nationality is required"),
  stateOfOrigin: z.string().min(1, "State of origin is required"),
  lga: z.string().min(1, "LGA is required"),
  maritalStatus: z.enum(["single", "married", "divorced", "widowed"]),
  address: z.string().min(5, "Address is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Valid email is required"),
  nextOfKinName: z.string().min(2, "Next of kin name is required"),
  nextOfKinRelationship: z.string().min(2, "Relationship is required"),
  nextOfKinPhone: z.string().min(10, "Valid phone is required"),
  nextOfKinAddress: z.string().min(5, "Address is required"),
  emergencyContactName: z.string().min(2, "Emergency contact name is required"),
  emergencyContactRelationship: z.string().min(2, "Relationship is required"),
  emergencyContactPhone: z.string().min(10, "Valid phone is required"),
  emergencyContactAddress: z.string().min(5, "Address is required"),
  computerLiteracy: z.enum(["proficient", "basic", "none"], { required_error: "Please indicate your computer literacy level" }),
});

function Step2PersonalInfo({ app, onNext, onBack, token }: { app: any; onNext: () => void; onBack: () => void; token: string }) {
  const saveInfo = useSavePersonalInfo();
  
  const form = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      fullName: app.personalInfo?.fullName || "",
      dateOfBirth: app.personalInfo?.dateOfBirth || "",
      gender: (app.personalInfo?.gender as any) || "male",
      nationality: app.personalInfo?.nationality || "Nigerian",
      stateOfOrigin: app.personalInfo?.stateOfOrigin || "",
      lga: app.personalInfo?.lga || "",
      maritalStatus: (app.personalInfo?.maritalStatus as any) || "single",
      address: app.personalInfo?.address || "",
      phone: app.personalInfo?.phone || "",
      email: app.personalInfo?.email || "",
      nextOfKinName: app.personalInfo?.nextOfKinName || "",
      nextOfKinRelationship: app.personalInfo?.nextOfKinRelationship || "",
      nextOfKinPhone: app.personalInfo?.nextOfKinPhone || "",
      nextOfKinAddress: app.personalInfo?.nextOfKinAddress || "",
      emergencyContactName: app.personalInfo?.emergencyContactName || "",
      emergencyContactRelationship: app.personalInfo?.emergencyContactRelationship || "",
      emergencyContactPhone: app.personalInfo?.emergencyContactPhone || "",
      emergencyContactAddress: app.personalInfo?.emergencyContactAddress || "",
      computerLiteracy: ((app.personalInfo as any)?.computerLiteracy as "proficient" | "basic" | "none") || undefined,
    }
  });

  const onSubmit = (values: z.infer<typeof personalInfoSchema>) => {
    saveInfo.mutate({ token, data: values }, {
      onSuccess: () => onNext()
    });
  };

  return (
    <div className="bg-card border shadow-sm rounded-xl p-6 md:p-8 animate-in fade-in zoom-in-95 duration-300">
      <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">Basic Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <FormField control={form.control} name="fullName" render={({ field }) => (
                <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                <FormItem><FormLabel>Date of Birth</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="gender" render={({ field }) => (
                <FormItem><FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="maritalStatus" render={({ field }) => (
                <FormItem><FormLabel>Marital Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married</SelectItem>
                      <SelectItem value="divorced">Divorced</SelectItem>
                      <SelectItem value="widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="nationality" render={({ field }) => (
                <FormItem><FormLabel>Nationality</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="stateOfOrigin" render={({ field }) => (
                <FormItem><FormLabel>State of Origin</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="lga" render={({ field }) => (
                <FormItem><FormLabel>LGA</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <FormField control={form.control} name="address" render={({ field }) => (
              <FormItem><FormLabel>Residential Address</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">Next of Kin</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <FormField control={form.control} name="nextOfKinName" render={({ field }) => (
                <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="nextOfKinRelationship" render={({ field }) => (
                <FormItem><FormLabel>Relationship</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="nextOfKinPhone" render={({ field }) => (
                <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="nextOfKinAddress" render={({ field }) => (
                <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">Emergency Contact</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <FormField control={form.control} name="emergencyContactName" render={({ field }) => (
                <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="emergencyContactRelationship" render={({ field }) => (
                <FormItem><FormLabel>Relationship</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="emergencyContactPhone" render={({ field }) => (
                <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="emergencyContactAddress" render={({ field }) => (
                <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">Computer Literacy</h3>
            <p className="text-sm text-muted-foreground">This role involves operating computer-based betting terminals. Please indicate your level of computer proficiency.</p>
            <FormField control={form.control} name="computerLiteracy" render={({ field }) => (
              <FormItem>
                <FormLabel>Are you computer literate? <span className="text-destructive">*</span></FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select your computer literacy level" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="proficient">Yes — Proficient (comfortable with computers and software)</SelectItem>
                    <SelectItem value="basic">Yes — Basic Knowledge (can perform simple tasks)</SelectItem>
                    <SelectItem value="none">No — Not computer literate</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <div className="flex justify-between pt-6 border-t">
            <Button type="button" variant="outline" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
            <Button type="submit" disabled={saveInfo.isPending}>
              {saveInfo.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Save & Continue <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

// ---------------------------------------------------------
// STEP 3: Documents Upload
// ---------------------------------------------------------
function FileUploadSlot({ title, fileType, required, token, existingDoc, onUploadComplete }: any) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max file size is 5MB", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    try {
      await uploadFile(token, file, fileType);
      toast({ title: "Upload successful", description: `${title} uploaded successfully.` });
      onUploadComplete();
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-muted/10">
      <div>
        <h4 className="font-semibold text-sm flex items-center gap-2">
          {title} {required && <span className="text-destructive">*</span>}
        </h4>
        {existingDoc ? (
          <div className="flex items-center gap-2 text-sm text-green-600 mt-1">
            <CheckCircle2 className="w-4 h-4" /> <span>{existingDoc.fileName}</span>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground mt-1">PDF, PNG, JPG (Max 5MB)</p>
        )}
      </div>
      <div className="shrink-0 w-full md:w-auto">
        <input 
          type="file" 
          id={`file-${fileType}`} 
          className="hidden" 
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        <label htmlFor={`file-${fileType}`} className={`cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : existingDoc ? <UploadCloud className="w-4 h-4 mr-2" /> : <UploadCloud className="w-4 h-4 mr-2" />}
          {isUploading ? "Uploading..." : existingDoc ? "Replace File" : "Upload File"}
        </label>
      </div>
    </div>
  );
}

function Step3Documents({ app, onNext, onBack, token }: { app: any; onNext: () => void; onBack: () => void; token: string }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const refreshDocs = () => {
    queryClient.invalidateQueries({ queryKey: getResumeApplicationQueryKey(token) });
  };

  const getDoc = (type: string) => app.documents?.find((d: any) => d.fileType === type);

  const slots = [
    { title: "Passport Photograph", fileType: "passport", required: true },
    { title: "Curriculum Vitae (CV)", fileType: "cv", required: true },
    { title: "Academic Certificates", fileType: "certificate", required: true },
    { title: "Valid Identification", fileType: "id", required: true },
    { title: "Proof of Address", fileType: "proof_of_address", required: true },
    { title: "Medical Fitness Report", fileType: "medical", required: false },
  ];

  const handleNext = () => {
    const missing = slots.filter(s => s.required && !getDoc(s.fileType));
    if (missing.length > 0) {
      toast({ title: "Missing Documents", description: `Please upload all required documents: ${missing.map(m => m.title).join(", ")}`, variant: "destructive" });
      return;
    }
    onNext();
  };

  return (
    <div className="bg-card border shadow-sm rounded-xl p-6 md:p-8 animate-in fade-in zoom-in-95 duration-300">
      <h2 className="text-2xl font-bold mb-2">Upload Documents</h2>
      <p className="text-muted-foreground mb-6">Please provide clear, legible copies of the following documents.</p>
      
      <div className="space-y-4 mb-8">
        {slots.map((slot) => (
          <FileUploadSlot 
            key={slot.fileType}
            {...slot}
            token={token}
            existingDoc={getDoc(slot.fileType)}
            onUploadComplete={refreshDocs}
          />
        ))}
      </div>

      <div className="flex justify-between pt-6 border-t">
        <Button variant="outline" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
        <Button onClick={handleNext}>Save & Continue <ArrowRight className="w-4 h-4 ml-2" /></Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// STEP 4: Guarantor Info
// ---------------------------------------------------------
const guarantorSchema = z.object({
  guarantorFullName: z.string().min(2, "Required"),
  guarantorAddress: z.string().min(5, "Required"),
  guarantorOccupation: z.string().min(2, "Required"),
  guarantorPlaceOfWork: z.string().min(2, "Required"),
  guarantorPhone: z.string().min(10, "Required"),
  guarantorEmail: z.string().email("Valid email required"),
  guarantorRelationship: z.string().min(2, "Required"),
  guarantorYearsKnown: z.coerce.number().min(1, "Required"),
  guarantorIdType: z.string().min(1, "Required"),
  guarantorIdNumber: z.string().min(1, "Required"),
  guarantorIdIssueDate: z.string().min(1, "Required"),
  guarantorIdExpiryDate: z.string().min(1, "Required"),
  witnessName: z.string().min(2, "Required"),
  witnessAddress: z.string().min(5, "Required"),
  witnessPhone: z.string().min(10, "Required"),
  declarationAccepted: z.boolean().refine(val => val === true, "You must certify this information"),
});

function Step4Guarantor({ app, onNext, onBack, token }: { app: any; onNext: () => void; onBack: () => void; token: string }) {
  const saveInfo = useSaveGuarantorInfo();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof guarantorSchema>>({
    resolver: zodResolver(guarantorSchema),
    defaultValues: {
      guarantorFullName: app.guarantorInfo?.guarantorFullName || "",
      guarantorAddress: app.guarantorInfo?.guarantorAddress || "",
      guarantorOccupation: app.guarantorInfo?.guarantorOccupation || "",
      guarantorPlaceOfWork: app.guarantorInfo?.guarantorPlaceOfWork || "",
      guarantorPhone: app.guarantorInfo?.guarantorPhone || "",
      guarantorEmail: app.guarantorInfo?.guarantorEmail || "",
      guarantorRelationship: app.guarantorInfo?.guarantorRelationship || "",
      guarantorYearsKnown: app.guarantorInfo?.guarantorYearsKnown || 0,
      guarantorIdType: app.guarantorInfo?.guarantorIdType || "",
      guarantorIdNumber: app.guarantorInfo?.guarantorIdNumber || "",
      guarantorIdIssueDate: app.guarantorInfo?.guarantorIdIssueDate || "",
      guarantorIdExpiryDate: app.guarantorInfo?.guarantorIdExpiryDate || "",
      witnessName: app.guarantorInfo?.witnessName || "",
      witnessAddress: app.guarantorInfo?.witnessAddress || "",
      witnessPhone: app.guarantorInfo?.witnessPhone || "",
      declarationAccepted: app.guarantorInfo?.declarationAccepted || false,
    }
  });

  const getDoc = (type: string) => app.documents?.find((d: any) => d.fileType === type);

  const refreshDocs = () => {
    queryClient.invalidateQueries({ queryKey: getResumeApplicationQueryKey(token) });
  };

  const onSubmit = (values: z.infer<typeof guarantorSchema>) => {
    if (!getDoc("guarantor_passport") || !getDoc("guarantor_id")) {
      toast({ title: "Missing Uploads", description: "Please upload Guarantor Passport and ID", variant: "destructive" });
      return;
    }
    saveInfo.mutate({ token, data: values }, {
      onSuccess: () => onNext()
    });
  };

  return (
    <div className="bg-card border shadow-sm rounded-xl p-6 md:p-8 animate-in fade-in zoom-in-95 duration-300">
      <h2 className="text-2xl font-bold mb-2">Guarantor Information</h2>
      <p className="text-muted-foreground mb-6">Provide details of a reliable guarantor. We will contact them to verify your character.</p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">Guarantor Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <FormField control={form.control} name="guarantorFullName" render={({ field }) => (
                <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="guarantorPhone" render={({ field }) => (
                <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="guarantorEmail" render={({ field }) => (
                <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="guarantorRelationship" render={({ field }) => (
                <FormItem><FormLabel>Relationship to you</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="guarantorYearsKnown" render={({ field }) => (
                <FormItem><FormLabel>Years Known</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="guarantorOccupation" render={({ field }) => (
                <FormItem><FormLabel>Occupation</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="guarantorPlaceOfWork" render={({ field }) => (
                <FormItem><FormLabel>Place of Work</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <FormField control={form.control} name="guarantorAddress" render={({ field }) => (
              <FormItem><FormLabel>Residential Address</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">Guarantor Identification</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <FormField control={form.control} name="guarantorIdType" render={({ field }) => (
                <FormItem><FormLabel>ID Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select ID Type" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="NIN">National Identity Number (NIN)</SelectItem>
                      <SelectItem value="Driver's License">Driver's License</SelectItem>
                      <SelectItem value="International Passport">International Passport</SelectItem>
                      <SelectItem value="Voter's Card">Voter's Card</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="guarantorIdNumber" render={({ field }) => (
                <FormItem><FormLabel>ID Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="guarantorIdIssueDate" render={({ field }) => (
                <FormItem><FormLabel>Issue Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="guarantorIdExpiryDate" render={({ field }) => (
                <FormItem><FormLabel>Expiry Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            
            <div className="space-y-4 bg-muted/20 p-4 rounded-lg border">
              <FileUploadSlot 
                title="Guarantor Passport Photograph" 
                fileType="guarantor_passport" 
                required={true}
                token={token}
                existingDoc={getDoc("guarantor_passport")}
                onUploadComplete={refreshDocs}
              />
              <FileUploadSlot 
                title="Guarantor Valid ID" 
                fileType="guarantor_id" 
                required={true}
                token={token}
                existingDoc={getDoc("guarantor_id")}
                onUploadComplete={refreshDocs}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">Witness</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <FormField control={form.control} name="witnessName" render={({ field }) => (
                <FormItem><FormLabel>Witness Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="witnessPhone" render={({ field }) => (
                <FormItem><FormLabel>Witness Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="md:col-span-2">
                <FormField control={form.control} name="witnessAddress" render={({ field }) => (
                  <FormItem><FormLabel>Witness Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
            </div>
          </div>

          <FormField control={form.control} name="declarationAccepted" render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm bg-muted/10">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>I certify that all information provided about the guarantor is true and correct. I understand that false information will lead to disqualification.</FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )} />

          <div className="flex justify-between pt-6 border-t">
            <Button type="button" variant="outline" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
            <Button type="submit" disabled={saveInfo.isPending}>
              {saveInfo.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Save & Continue <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

// ---------------------------------------------------------
// STEP 5: Employment Agreement
// ---------------------------------------------------------
function Step5Agreement({ app, onNext, onBack, token }: { app: any; onNext: () => void; onBack: () => void; token: string }) {
  const saveInfo = useSaveAgreement();
  const { toast } = useToast();
  const [agreed, setAgreed] = useState(app.agreementAccepted || false);
  const [fullName, setFullName] = useState("");
  const sigPad = useRef<SignatureCanvas>(null);

  const clearSig = () => {
    sigPad.current?.clear();
  };

  const handleSave = () => {
    if (!agreed) {
      toast({ title: "Agreement Required", description: "You must check the agreement box.", variant: "destructive" });
      return;
    }
    if (fullName.trim().toLowerCase() !== app.personalInfo?.fullName?.trim().toLowerCase()) {
      toast({ title: "Name Mismatch", description: "The typed name must match your full name exactly.", variant: "destructive" });
      return;
    }
    if (!app.signatureData && sigPad.current?.isEmpty()) {
      toast({ title: "Signature Required", description: "Please provide your signature.", variant: "destructive" });
      return;
    }

    const signatureData = app.signatureData || sigPad.current?.getTrimmedCanvas().toDataURL('image/png');

    saveInfo.mutate({
      token,
      data: {
        agreedToTerms: agreed,
        fullNameConfirmation: fullName,
        signatureData: signatureData as string
      }
    }, {
      onSuccess: () => onNext()
    });
  };

  return (
    <div className="bg-card border shadow-sm rounded-xl p-6 md:p-8 animate-in fade-in zoom-in-95 duration-300">
      <h2 className="text-2xl font-bold mb-6 text-center">Employment Agreement</h2>
      
      <div className="bg-muted/10 border p-6 rounded-xl max-h-[400px] overflow-y-auto text-sm leading-relaxed mb-8 prose prose-sm max-w-none">
        <h3 className="font-bold text-lg text-center mb-4">KAMPULSE HANDLING SOLUTIONS LTD — EMPLOYMENT AGREEMENT</h3>
        <p>This Agreement is made between Kampulse Handling Solutions Ltd ("The Company") and the Employee named above.</p>
        <ol className="list-decimal pl-5 space-y-2 mt-4">
          <li><strong>JOB TITLE & DESCRIPTION:</strong> Betshop Cashier — Responsible for cash handling, customer transactions, record keeping, and maintaining shop order at the Osubi Delta State location.</li>
          <li><strong>SALARY:</strong> Basic salary of ₦70,000 per month, paid at the end of each month via bank transfer.</li>
          <li><strong>WORKING HOURS:</strong> Monday to Saturday, 8:00 AM – 5:00 PM. Sunday is a rest day. Any work beyond standard hours requires management approval.</li>
          <li><strong>TRANSPORT ALLOWANCE:</strong> ₦2,000 daily / ₦12,000 weekly, payable alongside monthly salary.</li>
          <li><strong>OVERTIME:</strong> Approved overtime sessions are compensated at ₦2,000 per session. Overtime must be pre-approved by management.</li>
          <li><strong>CODE OF CONDUCT:</strong> The Employee shall maintain professional behavior, punctuality, proper dress code, and respect for colleagues, management, and customers at all times. Misconduct including theft, insubordination, or fraud will result in immediate termination.</li>
          <li><strong>CONFIDENTIALITY:</strong> The Employee agrees to keep all business information, customer data, financial records, and company strategies strictly confidential, both during and after employment.</li>
          <li><strong>TERMINATION:</strong> The Company may terminate this agreement with 2 weeks notice or pay in lieu of notice for conduct issues. Immediate termination applies for gross misconduct.</li>
          <li><strong>RESIGNATION:</strong> The Employee must provide 2 weeks written notice of resignation. Failure to do so may result in forfeiture of outstanding salary.</li>
          <li><strong>GOVERNING LAW:</strong> This agreement is governed by the laws of the Federal Republic of Nigeria.</li>
        </ol>
      </div>

      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="flex items-start space-x-3">
          <Checkbox id="agree" checked={agreed} onCheckedChange={(c) => setAgreed(c as boolean)} />
          <label htmlFor="agree" className="text-sm font-medium leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70 pt-0.5">
            I have read and agree to the Employment Agreement, and I consent to Kampulse Handling
            Solutions Ltd collecting and using my personal data for recruitment purposes in accordance
            with the{" "}
            <a
              href="/privacy-policy"
              target="_blank"
              rel="noreferrer noopener"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              Privacy Policy
            </a>
            .
          </label>
        </div>

        <div>
          <label className="text-sm font-medium block mb-2">Type your full name to confirm ({app.personalInfo?.fullName})</label>
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Type your full name" />
        </div>

        <div>
          <label className="text-sm font-medium block mb-2">Draw your signature below</label>
          {app.signatureData ? (
            <div className="border rounded-lg p-4 bg-muted/10 relative">
              <img src={app.signatureData} alt="Signature" className="max-h-32 mx-auto" />
              <div className="absolute top-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">Previously Saved</div>
            </div>
          ) : (
            <div className="border rounded-lg bg-white overflow-hidden shadow-inner">
              <SignatureCanvas 
                ref={sigPad}
                penColor="black"
                canvasProps={{className: 'w-full h-40'}}
              />
              <div className="bg-muted p-2 flex justify-end border-t">
                <Button type="button" variant="ghost" size="sm" onClick={clearSig}>Clear</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-8 border-t mt-8">
        <Button variant="outline" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
        <Button onClick={handleSave} disabled={saveInfo.isPending}>
          {saveInfo.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          Sign & Continue <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// STEP 6: Review & Submit
// ---------------------------------------------------------
function Step6Review({ app, onBack, token, setStep }: { app: any; onBack: () => void; token: string; setStep: (step: number) => void }) {
  const submitApp = useSubmitApplication();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = () => {
    submitApp.mutate({ token }, {
      onSuccess: () => {
        toast({ title: "Application Submitted", description: "Your application has been received successfully." });
        setLocation("/apply/success");
      },
      onError: (err: any) => {
        toast({ title: "Submission Failed", description: err.message, variant: "destructive" });
      }
    });
  };

  const SectionHeader = ({ title, step }: { title: string; step: number }) => (
    <div className="flex items-center justify-between mb-4 pb-2 border-b">
      <h3 className="text-lg font-bold">{title}</h3>
      <Button variant="ghost" size="sm" onClick={() => setStep(step)} className="text-primary h-8 px-2">Edit</Button>
    </div>
  );

  return (
    <div className="bg-card border shadow-sm rounded-xl p-6 md:p-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-2">Review Your Application</h2>
        <p className="text-muted-foreground">Please review all information before submitting.</p>
      </div>

      <div className="space-y-10">
        <section>
          <SectionHeader title="Job Application" step={1} />
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-muted-foreground block">Position:</span> <span className="font-medium">{app.jobTitle}</span></div>
            <div><span className="text-muted-foreground block">Expected Start:</span> <span className="font-medium">{app.expectedStartDate}</span></div>
          </div>
        </section>

        <section>
          <SectionHeader title="Personal Information" step={2} />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div><span className="text-muted-foreground block">Full Name:</span> <span className="font-medium">{app.personalInfo?.fullName}</span></div>
            <div><span className="text-muted-foreground block">Email:</span> <span className="font-medium">{app.personalInfo?.email}</span></div>
            <div><span className="text-muted-foreground block">Phone:</span> <span className="font-medium">{app.personalInfo?.phone}</span></div>
            <div className="col-span-2"><span className="text-muted-foreground block">Address:</span> <span className="font-medium">{app.personalInfo?.address}</span></div>
          </div>
        </section>

        <section>
          <SectionHeader title="Documents" step={3} />
          <div className="flex flex-wrap gap-2">
            {app.documents?.map((doc: any) => (
              <div key={doc.id} className="bg-muted/30 border px-3 py-1.5 rounded-md text-sm flex items-center">
                <File className="w-3 h-3 mr-2 text-primary" /> {doc.fileType.replace(/_/g, ' ')}
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader title="Guarantor" step={4} />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div><span className="text-muted-foreground block">Guarantor Name:</span> <span className="font-medium">{app.guarantorInfo?.guarantorFullName}</span></div>
            <div><span className="text-muted-foreground block">Phone:</span> <span className="font-medium">{app.guarantorInfo?.guarantorPhone}</span></div>
            <div><span className="text-muted-foreground block">Relationship:</span> <span className="font-medium">{app.guarantorInfo?.guarantorRelationship}</span></div>
          </div>
        </section>

        <section>
          <SectionHeader title="Agreement" step={5} />
          <div className="flex items-center text-sm">
            {app.agreementAccepted ? (
              <span className="text-green-600 flex items-center font-medium"><CheckCircle2 className="w-4 h-4 mr-2" /> Signed and Accepted</span>
            ) : (
              <span className="text-red-500 flex items-center font-medium"><X className="w-4 h-4 mr-2" /> Not Signed</span>
            )}
          </div>
        </section>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-10 border-t mt-10">
        <Button variant="outline" onClick={onBack} className="w-full sm:w-auto"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
        <Button onClick={handleSubmit} size="lg" className="w-full sm:w-auto text-lg px-8" disabled={submitApp.isPending}>
          {submitApp.isPending ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <CheckCircle2 className="w-5 h-5 mr-2" />}
          Submit Application
        </Button>
      </div>
    </div>
  );
}
