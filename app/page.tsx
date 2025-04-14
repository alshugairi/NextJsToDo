"use client";

import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { TaskRequest } from "@/app/services/Task/TaskRequest";
import TaskList from "@/app/components/modules/tasks/TaskList";
import AddTaskModal from "@/app/components/modules/tasks/AddTaskModal"; // New import
import { useRouter } from "next/navigation";
import ReactPagination from "@/app/components/lib/Pagination/ReactPagination";

export default function Home() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { data, loading, error } = useSelector((state: any) => state.task.tasks);
    let token = Cookies.get("token");

    const [page, setPage] = useState(1);

    useEffect(() => {
        dispatch(TaskRequest({ page }) as any);
    }, [page, dispatch]);

    useEffect(() => {
        if (!token) {
            router.push("/signin");
        }
    }, [token]);

    if (!token) {
        return null;
    }

    return (
        <>
            <ToastContainer />
            <div className="container py-5">
                <header className="mb-5">
                    <div className="row align-items-center">
                        <div className="col">
                            <h1 className="display-5 fw-bold">Todo List</h1>
                            <p className="lead text-muted">Manage your tasks with ease</p>
                        </div>
                        <div className="col-auto">
                            <button
                                className="btn btn-primary btn-lg"
                                data-bs-toggle="modal"
                                data-bs-target="#addTodoModal"
                            >
                                <i className="fa fa-plus-lg me-2"></i>Add New Todo
                            </button>
                        </div>
                    </div>
                </header>

                <div className="row mb-4 g-3">
                    <div className="col-md-6">
                        <div className="input-group">
              <span className="input-group-text bg-white">
                <i className="fa fa-search"></i>
              </span>
                            <input
                                type="text"
                                id="searchInput"
                                className="form-control"
                                placeholder="Search todos..."
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="d-flex gap-2">
                            <div className="btn-group flex-grow-1">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary active"
                                    data-filter="all"
                                >
                                    All
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    data-filter="active"
                                >
                                    Active
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    data-filter="completed"
                                >
                                    Completed
                                </button>
                            </div>
                            <div className="dropdown">
                                <button
                                    className="btn btn-outline-secondary dropdown-toggle"
                                    type="button"
                                    id="priorityFilterDropdown"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Priority
                                </button>
                                <ul
                                    className="dropdown-menu"
                                    aria-labelledby="priorityFilterDropdown"
                                >
                                    <li>
                                        <a
                                            className="dropdown-item active"
                                            href="#"
                                            data-priority-filter="all"
                                        >
                                            All Priorities
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className="dropdown-item"
                                            href="#"
                                            data-priority-filter="high"
                                        >
                                            High
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className="dropdown-item"
                                            href="#"
                                            data-priority-filter="medium"
                                        >
                                            Medium
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className="dropdown-item"
                                            href="#"
                                            data-priority-filter="low"
                                        >
                                            Low
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className="dropdown-item"
                                            href="#"
                                            data-priority-filter="none"
                                        >
                                            None
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="dropdown">
                                <button
                                    className="btn btn-outline-secondary dropdown-toggle"
                                    type="button"
                                    id="sortDropdown"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Sort
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="sortDropdown">
                                    <li>
                                        <a
                                            className="dropdown-item active"
                                            href="#"
                                            data-sort="newest"
                                        >
                                            Newest First
                                        </a>
                                    </li>
                                    <li>
                                        <a className="dropdown-item" href="#" data-sort="oldest">
                                            Oldest First
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className="dropdown-item"
                                            href="#"
                                            data-sort="priority-desc"
                                        >
                                            Priority (High-Low)
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className="dropdown-item"
                                            href="#"
                                            data-sort="priority-asc"
                                        >
                                            Priority (Low-High)
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <TaskList data={data} loading={loading} error={error} />

                <ReactPagination handlePageClick={(e:any) => setPage(e.selected + 1) } type={'task'} />
            </div>

            <AddTaskModal page={page} />
            <div
                className="modal fade"
                id="editTodoModal"
                tabIndex={-1}
                aria-labelledby="editTodoModalLabel"
                aria-hidden="true"
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
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <form id="editTodoForm">
                                <input type="hidden" id="editTodoId" />
                                <div className="mb-3">
                                    <label htmlFor="editTodoTitle" className="form-label">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="editTodoTitle"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="editTodoDescription" className="form-label">
                                        Description
                                    </label>
                                    <textarea
                                        className="form-control"
                                        id="editTodoDescription"
                                    ></textarea>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="editTodoPriority" className="form-label">
                                        Priority
                                    </label>
                                    <select className="form-select" id="editTodoPriority">
                                        <option value="none">No Priority</option>
                                        <option value="low">Low Priority</option>
                                        <option value="medium">Medium Priority</option>
                                        <option value="high">High Priority</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Attachment (PDF only)</label>
                                    <div className="file-upload-wrapper">
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary w-100"
                                        >
                                            <i className="fa fa-upload me-2"></i>Choose PDF File
                                        </button>
                                        <input type="file" id="editTodoFile" accept=".pdf" />
                                    </div>
                                    <div id="editSelectedFileName" className="form-text mt-1"></div>
                                    <div id="currentAttachment" className="form-text mt-2">
                    <span className="badge bg-secondary">
                      <i className="fa fa-file-earmark-pdf me-1"></i>
                      <span id="currentFileName"></span>
                    </span>
                                    </div>
                                </div>
                                <div className="form-check mb-3">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="editTodoCompleted"
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="editTodoCompleted"
                                    >
                                        Mark as completed
                                    </label>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                id="updateTodoBtn"
                            >
                                Update Todo
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className="modal fade"
                id="deleteTodoModal"
                tabIndex={-1}
                aria-labelledby="deleteTodoModalLabel"
                aria-hidden="true"
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
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete this todo?</p>
                            <input type="hidden" id="deleteTodoId" />
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                id="confirmDeleteBtn"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="alert-fixed">
                <div
                    className="alert alert-success alert-dismissible fade"
                    id="alertBox"
                    role="alert"
                >
                    <span id="alertMessage"></span>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="alert"
                        aria-label="Close"
                    ></button>
                </div>
            </div>
        </>
    );
}