// @/app/components/modules/tasks/AddTaskModal.tsx
"use client";

import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState, useEffect, useRef } from "react";
import { AddTaskRequest } from "@/app/services/Task/AddTaskRequest";
import { TaskRequest } from "@/app/services/Task/TaskRequest";
import { toast } from "react-toastify";
import { Modal } from "bootstrap";

const AddTaskSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    priority: Yup.string()
        .oneOf(["low", "medium", "high"], "Invalid priority")
        .required("Priority is required"),
    completed: Yup.boolean(),
    attachment: Yup.mixed()
        .nullable()
        .test("fileType", "Only PDF files are allowed", (value) => {
            if (!value) return true;
            return value.type === "application/pdf";
        })
        .test("fileSize", "File size must be less than 2MB", async (value) => {
            if (!value) return true;
            const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = () => reject(new Error("Failed to read file"));
                reader.readAsDataURL(value);
            });
            const prefix = "data:application/pdf;base64,";
            const base64Data = base64.startsWith(prefix) ? base64.slice(prefix.length) : base64;
            const sizeBytes = (base64Data.length * 3) / 4;
            return sizeBytes <= 2 * 1024 * 1024; // 2MB
        }),
});


export default function AddTaskModal({ page }: any) {
    const dispatch = useDispatch();
    const modalRef = useRef<HTMLDivElement>(null);
    const [modalInstance, setModalInstance] = useState<Modal | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    useEffect(() => {
        if (modalRef.current && !modalInstance) {
            const modal = new Modal(modalRef.current, { backdrop: true });
            setModalInstance(modal);
        }

        return () => {
            if (modalInstance) {
                modalInstance.hide();
                modalInstance.dispose();
                document.body.classList.remove("modal-open");
                document.body.style.overflow = "";
                document.body.style.paddingRight = "";
                document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
            }
        };
    }, [modalInstance]);

    const formik = useFormik({
        initialValues: {
            title: "",
            description: "",
            priority: "low",
            completed: false,
            attachment: null,
        },
        validationSchema: AddTaskSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                let attachmentBase64 = null;
                if (values.attachment) {
                    attachmentBase64 = await new Promise<string>((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result as string);
                        reader.onerror = () => reject(new Error("Failed to read file"));
                        reader.readAsDataURL(values.attachment);
                    });
                }

                const taskData = {
                    title: values.title,
                    description: values.description || "",
                    priority: values.priority,
                    completed: values.completed,
                    attachment: attachmentBase64,
                };

                console.log("Submitting task:", taskData);
                const result = await dispatch(AddTaskRequest(taskData) as any).unwrap();
                toast.success("Task added successfully!");

                await dispatch(TaskRequest({ page }) as any);

                resetForm();
                setFileName(null);

                if (modalRef.current) {
                    console.log("Closing modal, backdrop count before:", document.querySelectorAll(".modal-backdrop").length);
                    const modal = Modal.getInstance(modalRef.current) || modalInstance;
                    if (modal) {
                        modal.hide();
                        modal.dispose();
                        setTimeout(() => {
                            document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
                            document.body.classList.remove("modal-open");
                            document.body.style.overflow = "";
                            document.body.style.paddingRight = "";
                            console.log("Backdrop count after:", document.querySelectorAll(".modal-backdrop").length);
                        }, 300);
                    }
                }
            } catch (error: any) {
                console.error("Failed to add task:", error);
                toast.error(error.message || "Failed to add task. Please try again.");
            }
        },
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        if (file && file.type !== "application/pdf") {
            formik.setFieldError("attachment", "Only PDF files are allowed");
            setFileName(null);
            formik.setFieldValue("attachment", null);
            return;
        }
        formik.setFieldValue("attachment", file);
        setFileName(file ? file.name : null);
    };

    const handleCancel = () => {
        if (modalInstance) {
            modalInstance.hide();
        }
    };

    return (
        <div
            className="modal fade"
            id="addTodoModal"
            tabIndex={-1}
            aria-labelledby="addTodoModalLabel"
            aria-hidden="true"
            ref={modalRef}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="addTodoModalLabel">
                            Add New Todo
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={handleCancel}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={formik.handleSubmit} id="addTodoForm">
                            <div className="mb-3">
                                <label htmlFor="todoTitle" className="form-label">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    className={`form-control ${
                                        formik.touched.title && formik.errors.title ? "is-invalid" : ""
                                    }`}
                                    id="todoTitle"
                                    name="title"
                                    value={formik.values.title}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    required
                                />
                                {formik.touched.title && formik.errors.title && (
                                    <div className="invalid-feedback">{formik.errors.title}</div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="todoDescription" className="form-label">
                                    Description
                                </label>
                                <textarea
                                    className={`form-control ${
                                        formik.touched.description && formik.errors.description
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                    id="todoDescription"
                                    name="description"
                                    rows={3}
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                ></textarea>
                                {formik.touched.description && formik.errors.description && (
                                    <div className="invalid-feedback">
                                        {formik.errors.description}
                                    </div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="todoPriority" className="form-label">
                                    Priority
                                </label>
                                <select
                                    className={`form-select ${
                                        formik.touched.priority && formik.errors.priority
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                    id="todoPriority"
                                    name="priority"
                                    value={formik.values.priority}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                >
                                    <option value="low">Low Priority</option>
                                    <option value="medium">Medium Priority</option>
                                    <option value="high">High Priority</option>
                                </select>
                                {formik.touched.priority && formik.errors.priority && (
                                    <div className="invalid-feedback">{formik.errors.priority}</div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Attachment (PDF only)</label>
                                <div className="file-upload-wrapper">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary w-100"
                                        onClick={() =>
                                            document.getElementById("todoFile")?.click()
                                        }
                                    >
                                        <i className="fa fa-upload me-2"></i>Choose PDF File
                                    </button>
                                    <input
                                        type="file"
                                        name="attachment"
                                        id="todoFile"
                                        accept=".pdf"
                                        style={{ display: "none" }}
                                        onChange={handleFileChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </div>
                                <div id="selectedFileName" className="form-text mt-1">
                                    {fileName || "No file selected"}
                                </div>
                                {formik.touched.attachment && formik.errors.attachment && (
                                    <div className="text-danger small">
                                        {formik.errors.attachment}
                                    </div>
                                )}
                            </div>
                            <div className="form-check mb-3">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="todoCompleted"
                                    name="completed"
                                    checked={formik.values.completed}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                <label className="form-check-label" htmlFor="todoCompleted">
                                    Mark as completed
                                </label>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="addTodoForm"
                            className="btn btn-primary"
                            disabled={formik.isSubmitting}
                        >
                            {formik.isSubmitting ? (
                                <>
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                    Saving...
                                </>
                            ) : (
                                "Save Todo"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}