"use client";

import React, { useState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Local fallback toast when the app toast isn't working
  const [localToast, setLocalToast] = useState<{
    title: string;
    description?: string;
    variant?: "default" | "destructive";
  } | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const showLocalToast = (opts: {
    title: string;
    description?: string;
    variant?: "default" | "destructive";
  }) => {
    setLocalToast({
      // ensure a new object each time (avoid potential identity issues)
      ...opts,
      __ts: Date.now(),
    });
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setLocalToast(null), 5000);
  };

  const showToast = (opts: {
    title: string;
    description?: string;
    variant?: "default" | "destructive";
  }) => {
    // remove loading when showing toast so toast replaces loading UI
    setLoading(false);
    // Always show the local fallback immediately so the user always sees feedback
    showLocalToast(opts);
    // Then try the app toast (best-effort)
    try {
      if (typeof toast === "function") {
        toast(opts);
      }
    } catch {
      // ignore - local toast already shown
    }
  };
  const handleViewAction =
    (action: () => void | undefined) => async (e: React.MouseEvent) => {
      e.preventDefault();

      try {
        setLoading(true);
        const backendUrl = `${API_BASE_URL}/file/download_file?loan_id=${encodeURIComponent(
          loanId
        )}&file_basename=${encodeURIComponent(englishName)}`;

        const response = await fetch(backendUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        if (!response.ok) {
          console.error("Error downloading files:", await response.json());
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
      } finally {
        setLoading(false);
      }
    };
  const handleRequestDocument = (e: React.MouseEvent) => {
    e.preventDefault();
    onRequest?.();
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
        setLoading(true);
        const fileExtension = file.name.split(".").pop(); // Get original file extension
        const newFileName = `${englishName}.${fileExtension}`; // Rename file using key name
        const renamedFile = new File([file], newFileName, {
          type: file.type,
        });
        console.log(`Selected file: ${file.name} for document: ${name}`);
        // Here you would handle the file upload
        formData.append("files", renamedFile);
        formData.append("loan_id", loanId);

        try {
          const fileResponse = await fetch(
            `${API_BASE_URL}/file/upload_files`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              },
              body: formData,
            }
          );

          if (!fileResponse.ok) {
            const data = await fileResponse.json().catch(() => ({}));
            console.error("Error uploading files:", data.error);
            const unaccepted_files = Array.isArray(data.unaccepted_files)
              ? data.unaccepted_files
              : [];
            if (unaccepted_files.length > 0) {
              showToast({
                title: "Files not accepted",
                description: `The following files were not accepted: ${unaccepted_files.join(
                  ", "
                )}`,
                variant: "destructive",
              });
            } else {
              showToast({
                title: "Upload failed",
                description: "Error uploading file. Please try again.",
                variant: "destructive",
              });
            }
          } else {
            onReplace?.();
          }
        } catch (err) {
          console.error("Upload error:", err);
          showToast({
            title: "Upload failed",
            description: "Network error while uploading file.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
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
        setLoading(true);
        const fileExtension = file.name.split(".").pop(); // Get original file extension
        const newFileName = `${englishName}.${fileExtension}`; // Rename file using key name
        const renamedFile = new File([file], newFileName, {
          type: file.type,
        });
        console.log(`Selected file: ${file.name} for document: ${name}`);
        // Here you would handle the file upload
        formData.append("files", renamedFile);
        formData.append("loan_id", loanId);

        try {
          const fileResponse = await fetch(
            `${API_BASE_URL}/file/upload_files`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              },
              body: formData,
            }
          );

          if (!fileResponse.ok) {
            const data = await fileResponse.json().catch(() => ({}));
            console.error("Error uploading files:", data.error);
            const unaccepted_files = Array.isArray(data.unaccepted_files)
              ? data.unaccepted_files
              : [];
            if (unaccepted_files.length > 0) {
              showToast({
                title: "Files not accepted",
                description: `The following files were not accepted: ${unaccepted_files.join(
                  ", "
                )}`,
                variant: "destructive",
              });
            } else {
              showToast({
                title: "Upload failed",
                description: "Error uploading file. Please try again.",
                variant: "destructive",
              });
            }
          } else {
            onAdd?.();
          }
        } catch (err) {
          console.error("Upload error:", err);
          showToast({
            title: "Upload failed",
            description: "Network error while uploading file.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      }
    };
    input.click();
  };

  return (
    <>
      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-md p-4 flex items-center gap-3 shadow">
            <div className="w-6 h-6 border-4 border-t-transparent border-purple-600 rounded-full animate-spin" />
            <div className="font-medium">Processing…</div>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center p-2 border-b">
        <div className="flex gap-2 justify-end">
          {status === "uploaded" ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewAction(onView)}
              >
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
              onClick={handleRequestDocument}
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
      {/* Local fallback toast UI */}
      {localToast && (
        <div
          className={`fixed right-6 bottom-6 z-50 w-80 rounded-md shadow-lg p-4 border ${
            localToast.variant === "destructive"
              ? "bg-white border-red-200 text-red-700"
              : "bg-white border-gray-200 text-gray-800"
          }`}
          role="status"
        >
          <div className="font-semibold mb-1">{localToast.title}</div>
          {localToast.description && (
            <div className="text-sm">{localToast.description}</div>
          )}
        </div>
      )}
    </>
  );
}
