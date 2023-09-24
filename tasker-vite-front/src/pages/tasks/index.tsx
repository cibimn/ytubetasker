import _ from "lodash";
import { useState, useEffect, useRef } from "react";
import fakerData from "../../utils/faker";
import Button from "../../base-components/Button";
import Pagination from "../../base-components/Pagination";
import { FormInput, FormSelect } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import { Dialog, Menu } from "../../base-components/Headless";
import axios from 'axios';


function Main() {
    interface Task {
        title: string;
        created_at: string;
        assigned_editor: string;
        status: string;
        price: String;
        thumbnail_url: string;
        taskid: string;
    }

    const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
    const deleteButtonRef = useRef(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

    useEffect(() => {
        const results = tasks.filter(task =>
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.assigned_editor.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredTasks(results);
    }, [tasks, searchTerm]);

    const fetchTasks = () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        };

        axios.get(`http://localhost:8000/api/tasks/getall/`, config)
            .then(response => {
                setTasks(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching data', error);
            });
    };
    useEffect(() => {
        fetchTasks();
    }, []);
    const totalEntries = tasks.length;
    const totalFilteredTasks = filteredTasks.length;
    const start = (currentPage - 1) * entriesPerPage;
    const end = Math.min(start + entriesPerPage, totalFilteredTasks);
    const displayedTasks = filteredTasks.slice(start, end);
    const totalPages = Math.ceil(totalEntries / entriesPerPage);

    const handleEntriesPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setEntriesPerPage(Number(e.target.value));
        setCurrentPage(1);
    };
    const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
    const handleTaskDeleteClick = (taskId: string) => {
        setTaskToDelete(taskId);
        setDeleteConfirmationModal(true);
    };
    const removeTask = () => {
        if (taskToDelete) {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            };
            axios.post(`http://localhost:8000/api/tasks/delete/`, { id: taskToDelete }, config)
                .then(response => {
                    fetchTasks();
                    setDeleteConfirmationModal(false);
                })
                .catch(error => {
                    console.error("There was an error deleting the task", error);
                });
        }
    };
    return (
        <>
            <h2 className="mt-10 text-lg font-medium intro-y">Product Grid</h2>
            <div className="grid grid-cols-12 gap-6 mt-5">
                <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
                    <Button variant="primary"  className="mr-2 shadow-md">
                        <a href="/addtask" >Add New Product</a>
                    </Button>

                    <div className="hidden mx-auto md:block text-slate-500">
                        Showing {start + 1} to {end} of {totalEntries} entries
                    </div>
                    <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
                        <div className="relative w-56 text-slate-500">
                            <FormInput
                                type="text"
                                className="w-56 pr-10 !box"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Lucide
                                icon="Search"
                                className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
                            />
                        </div>
                    </div>
                </div>
                
                {/* BEGIN: Users Layout */}
                {displayedTasks.map((task, index) => (
                    <div
                        key={index}
                        className="col-span-12 intro-y md:col-span-6 lg:col-span-4 xl:col-span-3"
                    >
                        <div className="box">
                            <div className="p-5">
                                <div className="h-40 overflow-hidden rounded-md 2xl:h-56 image-fit before:block before:absolute before:w-full before:h-full before:top-0 before:left-0 before:z-10 before:bg-gradient-to-t before:from-black before:to-black/10">
                                    <img
                                        alt={task.taskid}
                                        className="rounded-md"
                                        src={task.thumbnail_url}
                                    />
                                    <div className="absolute bottom-0 z-10 px-5 pb-6 text-white">
                                        <a href="" className="block text-base font-medium">
                                            {task.assigned_editor}
                                        </a>
                                    </div>
                                </div>
                                <div className="mt-5 text-slate-600 dark:text-slate-500">
                                    <div className="flex items-center">
                                        <Lucide icon="Link" className="w-4 h-4 mr-2" /> Price: $
                                        {task.price}
                                    </div>
                                    <div className="flex items-center mt-2">
                                        <Lucide icon="Layers" className="w-4 h-4 mr-2" /> Created At
                                        {task.created_at}
                                    </div>
                                    <div className="flex items-center mt-2">
                                        <Lucide icon="CheckSquare" className="w-4 h-4 mr-2" />{" "}
                                        Status:
                                        {task.status ? "Active" : "Inactive"}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-center p-5 border-t lg:justify-end border-slate-200/60">
                            <a className="flex items-center mr-auto text-primary" href="#">
                                    <Lucide icon="Eye" className="w-4 h-4 mr-1" /> Preview
                                </a>
                                <a className="flex items-center mr-3" href="#">
                                    <Lucide icon="CheckSquare" className="w-4 h-4 mr-1" /> Edit
                                </a>
                                <a
                                    className="flex items-center text-danger"
                                    href="#"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        handleTaskDeleteClick(task.taskid);
                                        setDeleteConfirmationModal(true);
                                    }}
                                >
                                    <Lucide icon="Trash2" className="w-4 h-4 mr-1" /> Delete
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
                {/* END: Users Layout */}
                {/* BEGIN: Pagination */}
                <div className="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
                    <Pagination className="w-full sm:w-auto sm:mr-auto">
                        <Pagination.Link onClick={() => setCurrentPage(1)}>
                            <Lucide icon="ChevronsLeft" className="w-4 h-4" />
                        </Pagination.Link>
                        <Pagination.Link onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}>
                            <Lucide icon="ChevronLeft" className="w-4 h-4" />
                        </Pagination.Link>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <Pagination.Link
                                key={index}
                                active={currentPage === index + 1}
                                onClick={() => setCurrentPage(index + 1)}
                            >
                                {index + 1}
                            </Pagination.Link>
                        ))}
                        <Pagination.Link onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}>
                            <Lucide icon="ChevronRight" className="w-4 h-4" />
                        </Pagination.Link>
                        <Pagination.Link onClick={() => setCurrentPage(totalPages)}>
                            <Lucide icon="ChevronsRight" className="w-4 h-4" />
                        </Pagination.Link>
                    </Pagination>

                    <FormSelect className="w-20 mt-3 !box sm:mt-0" value={entriesPerPage} onChange={handleEntriesPerPageChange} >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={35}>35</option>
                        <option value={50}>50</option>
                    </FormSelect>
                </div>
                {/* END: Pagination */}
            </div>
            {/* BEGIN: Delete Confirmation Modal */}
            <Dialog
                open={deleteConfirmationModal}
                onClose={() => {
                    setDeleteConfirmationModal(false);
                }}
                initialFocus={deleteButtonRef}
            >
                <Dialog.Panel>
                    <div className="p-5 text-center">
                        <Lucide
                            icon="XCircle"
                            className="w-16 h-16 mx-auto mt-3 text-danger"
                        />
                        <div className="mt-5 text-3xl">Are you sure?</div>
                        <div className="mt-2 text-slate-500">
                            Do you really want to delete these records? <br />
                            This process cannot be undone.
                        </div>
                    </div>
                    <div className="px-5 pb-8 text-center">
                        <Button
                            variant="outline-secondary"
                            type="button"
                            onClick={() => {
                                setDeleteConfirmationModal(false);
                            }}
                            className="w-24 mr-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            type="button"
                            className="w-24"
                            ref={deleteButtonRef}
                            onClick={() => {
                                removeTask();
                            }}
                        >
                            Delete
                        </Button>
                    </div>
                </Dialog.Panel>
            </Dialog>
            {/* END: Delete Confirmation Modal */}
        </>
    );
}

export default Main;
