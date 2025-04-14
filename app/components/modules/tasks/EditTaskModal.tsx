"use client";

import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState, useEffect, useRef } from "react";
import { EditTaskRequest } from "@/app/services/Task/EditTaskRequest";
import { TaskRequest } from "@/app/services/Task/TaskRequest";
import { toast } from "react-toastify";
import { Modal } from "bootstrap";

const EditTaskSchema = Yup.object().shape({
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


export default function EditTaskModal({ page, task }: any) {
    const dispatch = useDispatch();
    const modalRef = useRef<HTMLDivElement>(null);
    const [modalInstance, setModalInstance] = useState<Modal | null>(null);
    const [fileName, setFileName] = useState<string | null>(task?.attachment || null);

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

    useEffect(() => {
        if (task && modalInstance) {
            modalInstance.show();
        }
    }, [task, modalInstance]);

    const formik = useFormik({
        initialValues: {
            title: task?.title || "",
            description: task?.description || "",
            priority: task?.priority || "low",
            completed: task?.completed || false,
            attachment: null,
        },
        validationSchema: EditTaskSchema,
        enableReinitialize: true,
        onSubmit: async (values, { resetForm }) => {
            try {
                const taskData = {
                    id: task.id,
                    title: values.title,
                    description: values.description || "",
                    priority: values.priority,
                    completed: values.completed,
                };
                console.log("Updating task:", taskData);
                const taskResult = await dispatch(EditTaskRequest(taskData) as any).unwrap();
                console.log("Task updated:", taskResult);

                toast.success("Task updated successfully!");
                await dispatch(TaskRequest({ page }) as any);

                resetForm();
                setFileName(null);
                modalInstance?.hide();
            } catch (error: any) {
                console.error("Failed to update task:", error);
                toast.error(error.message || "Failed to update task. Please try again.");
            }
        },
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        if (file) {
            if (file.type !== "application/pdf") {
                formik.setFieldError("attachment", "Only PDF files are allowed");
                setFileName(null);
                return;
            }
            formik.setFieldValue("attachment", file);
            setFileName(file.name);
        } else {
            formik.setFieldValue("attachment", null);
            setFileName(task?.attachment || null);
        }
    };

    const handleCancel = () => {
        if (modalInstance) {
            modalInstance.hide();
        }
    };

    if (!task) return null;

    return (
        <div
            className="modal fade"
            id="editTodoModal"
            tabIndex={-1}
            aria-labelledby="editTodoModalLabel"
            aria-hidden="true"
            ref={modalRef}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="editTodoModalLabel">
                            Edit Todo
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={handleCancel}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={formik.handleSubmit} id="editTodoForm" encType="multipart/form-data">
                            <input type="hidden" name="id" value={task.id} />
                            <div className="mb-3">
                                <label htmlFor="editTodoTitle" className="form-label">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    className={`form-control ${
                                        formik.touched.title && formik.errors.title ? "is-invalid" : ""
                                    }`}
                                    id="editTodoTitle"
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
                                <label htmlFor="editTodoDescription" className="form-label">
                                    Description
                                </label>
                                <textarea
                                    className={`form-control ${
                                        formik.touched.description && formik.errors.description
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                    id="editTodoDescription"
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
                                <label htmlFor="editTodoPriority" className="form-label">
                                    Priority
                                </label>
                                <select
                                    className={`form-select ${
                                        formik.touched.priority && formik.errors.priority
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                    id="editTodoPriority"
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
                                            document.getElementById("editTodoFile")?.click()
                                        }
                                    >
                                        <i className="fa fa-upload me-2"></i>Choose PDF File
                                    </button>
                                    <input
                                        type="file"
                                        name="attachment"
                                        id="editTodoFile"
                                        accept=".pdf"
                                        style={{ display: "none" }}
                                        onChange={handleFileChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </div>
                                <div id="editSelectedFileName" className="form-text mt-1">
                                    {fileName || "No file selected"}
                                </div>
                                {task?.file_path && !fileName && (
                                    <div className="form-text mt-2">
                                        <span className="badge bg-secondary">
                                            <i className="fa fa-file-earmark-pdf me-1"></i>
                                            {task.file_path}
                                        </span>
                                    </div>
                                )}
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
                                    id="editTodoCompleted"
                                    name="completed"
                                    checked={formik.values.completed}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                <label className="form-check-label" htmlFor="editTodoCompleted">
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
                            form="editTodoForm"
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
                                    Updating...
                                </>
                            ) : (
                                "Update Todo"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}