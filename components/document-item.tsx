"use client";

import type React from "react";

import { Button } from "@/components/ui/button";

interface DocumentItemProps {
  name: string;
  status: "uploaded" | "missing";
  userType: "borrower" | "financier";
  loanId: string;
  englishName: string;
  onView?: () => void;
  onReplace?: () => void;
  onAdd?: () => void;
  onRequest?: () => void;
}

const API_BASE_URL = "http://127.0.0.1:5000"; // Change if needed

export function DocumentItem({
  name,
  status,
  userType,
  loanId,
  englishName,
  onView,
  onReplace,
  onAdd,
  onRequest,
}: DocumentItemProps) {
  const handleAction =
    (action: () => void | undefined) => async (e: React.MouseEvent) => {
      e.preventDefault();

      try {

        const backendUrl = `${API_BASE_URL}/file/download_file?loan_id=${encodeURIComponent(loanId)}&file_basename=${encodeURIComponent(englishName)}`;
        
        const response = await fetch(backendUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          }
        });

        if (!response.ok) {
          console.error("Error uploading files:", await response.json());
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = englishName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error(error);
      }
    };

  const handleReplaceDocument = (e: React.MouseEvent) => {
    e.preventDefault();

    // Create a file input and trigger it
    const input = document.createElement("input");
    const formData = new FormData();
    input.type = "file";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const fileExtension = file.name.split(".").pop(); // Get original file extension
        const newFileName = `${englishName}.${fileExtension}`; // Rename file using key name
        const renamedFile = new File([file], newFileName, {
          type: file.type,
        });
        console.log(`Selected file: ${file.name} for document: ${name}`);
        // Here you would handle the file upload
        formData.append("files", renamedFile);
        formData.append("loan_id", loanId);

        const fileResponse = await fetch(`${API_BASE_URL}/file/upload_files`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: formData,
        });

        if (!fileResponse.ok) {
          console.error("Error uploading files:", await fileResponse.json());
        } else {
          onReplace?.();
        }
      }
    };
    input.click();

  };
  const handleAddDocument = (e: React.MouseEvent) => {
    e.preventDefault();

    // Create a file input and trigger it
    const input = document.createElement("input");
    const formData = new FormData();
    input.type = "file";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const fileExtension = file.name.split(".").pop(); // Get original file extension
        const newFileName = `${englishName}.${fileExtension}`; // Rename file using key name
        const renamedFile = new File([file], newFileName, {
          type: file.type,
        });
        console.log(`Selected file: ${file.name} for document: ${name}`);
        // Here you would handle the file upload
        formData.append("files", renamedFile);
        formData.append("loan_id", loanId);

        const fileResponse = await fetch(`${API_BASE_URL}/file/upload_files`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: formData,
        });

        if (!fileResponse.ok) {
          console.error("Error uploading files:", await fileResponse.json());
        } else {
          onAdd?.();
        }
      }
    };
    input.click();
  };

  return (
    <div className="flex justify-between items-center p-2 border-b">
      <div className="flex gap-2 justify-end">
        {status === "uploaded" ? (
          <>
            <Button variant="outline" size="sm" onClick={handleAction(onView)}>
              הצג מסמך
            </Button>
            {userType === "borrower" && (
              <Button
                variant="outline"
                size="sm"
                className="text-purple-600 border-purple-600 hover:bg-purple-50"
                onClick={handleReplaceDocument}
              >
                החלף מסמך
              </Button>
            )}
          </>
        ) : userType === "borrower" ? (
          <Button
            variant="outline"
            size="sm"
            className="text-blue-600"
            onClick={handleAddDocument}
          >
            הוסף מסמך
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="text-red-600"
            onClick={handleAction(onRequest)}
          >
            דרוש מסמך
          </Button>
        )}
      </div>

      <div className="text-right">
        <h3 className="font-semibold text-gray-700">{name}</h3>
        <span
          className={`text-xs ${
            status === "uploaded" ? "text-green-600" : "text-red-600"
          }`}
        >
          {status === "uploaded" ? "הועלה" : "חסר"}
        </span>
      </div>
    </div>
  );
}
