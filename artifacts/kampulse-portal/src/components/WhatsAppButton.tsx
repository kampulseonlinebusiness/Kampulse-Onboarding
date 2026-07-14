import React from "react";

const WHATSAPP_NUMBER = "2347040621103";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer noopener"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#25D366]"
      style={{ backgroundColor: "#25D366" }}
    >
      {/* WhatsApp SVG logo */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="w-8 h-8"
        fill="white"
        aria-hidden="true"
      >
        <path d="M16.003 2.667C8.638 2.667 2.667 8.638 2.667 16c0 2.366.636 4.656 1.845 6.663L2.667 29.333l6.86-1.8A13.27 13.27 0 0 0 16.003 29.333C23.362 29.333 29.333 23.362 29.333 16S23.362 2.667 16.003 2.667zm0 24.267a11.003 11.003 0 0 1-5.618-1.54l-.403-.24-4.07 1.067 1.087-3.96-.263-.41A10.999 10.999 0 0 1 5.003 16c0-6.076 4.924-11.003 11-11.003 6.073 0 11 4.927 11 11.003 0 6.077-4.927 11-11 11zm6.037-8.23c-.33-.165-1.953-.964-2.256-1.073-.304-.11-.525-.165-.747.165-.22.33-.855 1.073-1.048 1.293-.193.22-.385.248-.715.083-.33-.165-1.394-.514-2.656-1.638-.981-.875-1.643-1.955-1.835-2.285-.193-.33-.02-.508.145-.672.149-.148.33-.385.495-.578.165-.193.22-.33.33-.55.11-.22.055-.413-.028-.578-.083-.165-.747-1.8-1.023-2.466-.27-.648-.544-.56-.747-.57l-.637-.01a1.22 1.22 0 0 0-.884.413c-.303.33-1.157 1.13-1.157 2.756 0 1.626 1.185 3.197 1.35 3.418.165.22 2.33 3.556 5.65 4.989.789.34 1.405.543 1.886.695.792.252 1.513.217 2.083.132.635-.095 1.953-.798 2.228-1.568.275-.77.275-1.43.193-1.568-.083-.138-.303-.22-.633-.385z" />
      </svg>
    </a>
  );
}
