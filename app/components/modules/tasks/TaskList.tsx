"use client";

import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { DeleteTaskRequest } from "@/app/services/Task/DeleteTaskRequest";
import { TaskRequest } from "@/app/services/Task/TaskRequest";
import { toast } from "react-toastify";
import { Modal } from "bootstrap";
import EditTaskModal from "./EditTaskModal";

export default function TaskList({ data, loading, error, page }: any) {
    const dispatch = useDispatch();
    const deleteModalRef = useRef<HTMLDivElement>(null);
    const [deleteModalInstance, setDeleteModalInstance] = useState<Modal | null>(null);
    const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
    const [taskToEdit, setTaskToEdit] = useState<any | null>(null);
    const { delete_task } = useSelector((state: any) => state.task);

    useEffect(() => {
        if (deleteModalRef.current && !deleteModalInstance) {
            const modal = new Modal(deleteModalRef.current, { backdrop: true });
            setDeleteModalInstance(modal);
        }

        return () => {
            if (deleteModalInstance) {
                deleteModalInstance.hide();
                deleteModalInstance.dispose();
                document.body.classList.remove("modal-open");
                document.body.style.overflow = "";
                document.body.style.paddingRight = "";
                document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
            }
        };
    }, [deleteModalInstance]);

    const handleDeleteClick = (taskId: string) => {
        setTaskToDelete(taskId);
        if (deleteModalInstance) {
            deleteModalInstance.show();
        }
    };

    const handleEditClick = (task: any) => {
        setTaskToEdit(task);
    };

    const handleConfirmDelete = async () => {
        if (!taskToDelete) return;

        try {
            await dispatch(DeleteTaskRequest(taskToDelete) as any).unwrap();
            toast.success("Task deleted successfully!");
            await dispatch(TaskRequest({ page }) as any);
        } catch (error: any) {
            console.error("Failed to delete task:", error);
            toast.error(
                error.message || delete_task.error || "Failed to delete task. Please try again."
            );
        } finally {
            setTaskToDelete(null);
            if (deleteModalInstance) {
                deleteModalInstance.hide();
            }
        }
    };

    const handleDeleteCancel = () => {
        setTaskToDelete(null);
        if (deleteModalInstance) {
            deleteModalInstance.hide();
        }
    };

    return (
        <>
            <div className="card shadow-sm">
                <div className="card-header bg-white py-3">
                    <div className="row align-items-center">
                        <div className="col">
                            <h5 className="mb-0">Your Tasks</h5>
                        </div>
                        <div className="col-auto">
                            <span className="badge bg-primary rounded-pill" id="todoCount">
                                {data?.length || 0}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="list-group list-group-flush" id="todoList">
                    {loading && (
                        <div className="list-group-item text-center">Loading tasks...</div>
                    )}
                    {error && (
                        <div className="list-group-item text-danger">Error: {error}</div>
                    )}
                    {!loading && !error && data?.length === 0 && (
                        <div className="list-group-item text-center">
                            No tasks available.
                        </div>
                    )}
                    {!loading &&
                        !error &&
                        data?.map((task: any) => (
                            <div
                                key={task.id}
                                className={`list-group-item todo-item priority-${task.priority}`}
                                data-id={task.id}
                                data-priority={task.priority}
                                data-date={task.created_at}
                            >
                                <div className="d-flex w-100 justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={`todo${task.id}`}
                                                checked={task.completed}
                                                readOnly
                                            />
                                            <label
                                                className="form-check-label todo-title"
                                                htmlFor={`todo${task.id}`}
                                            >
                                                {task.title}
                                            </label>
                                        </div>
                                        {task.priority && task.priority !== "none" && (
                                            <span
                                                className={`badge priority-${task.priority}-bg ms-2 priority-badge`}
                                            >
                                                {task.priority.charAt(0).toUpperCase() +
                                                    task.priority.slice(1)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="btn-group">
                                        <div className="dropdown me-1">
                                            <button
                                                className="btn btn-sm btn-outline-secondary dropdown-toggle dropdown-toggle-no-caret"
                                                type="button"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            >
                                                <i className="fa fa-flag"></i>
                                            </button>
                                            <ul className="dropdown-menu dropdown-menu-end priority-dropdown">
                                                <li>
                                                    <a
                                                        className="dropdown-item"
                                                        href="#"
                                                        data-priority="high"
                                                    >
                                                        High Priority
                                                    </a>
                                                </li>
                                                <li>
                                                    <a
                                                        className="dropdown-item"
                                                        href="#"
                                                        data-priority="medium"
                                                    >
                                                        Medium Priority
                                                    </a>
                                                </li>
                                                <li>
                                                    <a
                                                        className="dropdown-item"
                                                        href="#"
                                                        data-priority="low"
                                                    >
                                                        Low Priority
                                                    </a>
                                                </li>
                                                <li>
                                                    <a
                                                        className="dropdown-item"
                                                        href="#"
                                                        data-priority="none"
                                                    >
                                                        No Priority
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                        <button
                                            className="btn btn-sm btn-outline-secondary btn-edit"
                                            onClick={() => handleEditClick(task)}
                                        >
                                            <i className="fa fa-pencil"></i>
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-danger btn-delete"
                                            onClick={() => handleDeleteClick(task.id)}
                                        >
                                            <i className="fa fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                                {task.description && (
                                    <p className="mb-1 mt-2 text-muted small">{task.description}</p>
                                )}
                                <div className="d-flex justify-content-between align-items-center mt-2">
                                    <small className="text-muted">
                                        Created: {task.created_at}
                                    </small>
                                    {task.attachment && (
                                        <span className="badge bg-secondary badge-pdf">
                                            <i className="fa fa-file-earmark-pdf me-1"></i>
                                            {task.attachment}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                </div>
                <div className="card-footer bg-white py-3">
                    <div
                        className={`text-center text-muted ${
                            data?.length > 0 ? "d-none" : ""
                        }`}
                        id="emptyState"
                    >
                        <i className="fa fa-check2-circle fs-3"></i>
                        <p className="mb-0 mt-2">No tasks to show</p>
                    </div>
                </div>
            </div>
            {taskToEdit && <EditTaskModal page={page} task={taskToEdit} />}
            <div
                className="modal fade"
                id="deleteTodoModal"
                tabIndex={-1}
                aria-labelledby="deleteTodoModalLabel"
                aria-hidden="true"
                ref={deleteModalRef}
            >
                <div className="modal-dialog modal-sm modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="deleteTodoModalLabel">
                                Confirm Delete
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                                onClick={handleDeleteCancel}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete this task?</p>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleDeleteCancel}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={handleConfirmDelete}
                                disabled={delete_task.loading}
                            >
                                {delete_task.loading ? (
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                            aria-hidden="true"
                                        ></span>
                                        Deleting...
                                    </>
                                ) : (
                                    "Delete"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}