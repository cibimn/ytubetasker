import _ from "lodash";
import { useState, useEffect, useRef } from "react";
import Button from "../../base-components/Button";
import Pagination from "../../base-components/Pagination";
import { FormInput, FormSelect, FormLabel, FormSwitch, FormTextarea, } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import { Dialog, Menu, Slideover } from "../../base-components/Headless";
import axios from 'axios';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Toastify from "toastify-js";
import clsx from "clsx";
import Notification from "../../base-components/Notification";
import Dropzone, { DropzoneElement } from "../../base-components/Dropzone";
import { useNavigate } from 'react-router-dom';

function Main() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    useEffect(() => {
        const checkLoggedInStatus = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/users/check_auth_status/', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });
                if (response.status === 200) {
                    console.log("User is authenticated");
                    setIsLoggedIn(true);
                } else {
                    // Redirect to login page if the status is anything other than 200.
                    navigate('/login');
                }
            } catch (error) {
                setIsLoggedIn(false);
                navigate('/login'); // Redirect to login page if there's an error.
            }
        };
    
        checkLoggedInStatus();
    }, [navigate]); // Add navigate as a dependency to the useEffect hook.
    
    
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
    const [superlargeSlideoverSizePreview, setSuperlargeSlideoverSizePreview] = useState(false);
    const schema = yup
        .object({
            name: yup.string().required().min(2),
            email: yup.string().required().email(),
            password: yup.string().required().min(6),
            age: yup
                .number()
                .required()
                .test("len", "age must be less than or equal to 3", (val) =>
                    val && val.toString().length <= 3 ? true : false
                ),
            url: yup.string().url(),
            comment: yup.string().required().min(10),
        })
        .required();

    const {
        register,
        trigger,
        formState: { errors },
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(schema),
    });
    const onSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        const result = await trigger();
        if (!result) {
            const failedEl = document
                .querySelectorAll("#failed-notification-content")[0]
                .cloneNode(true) as HTMLElement;
            failedEl.classList.remove("hidden");
            Toastify({
                node: failedEl,
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
            }).showToast();
        } else {
            const successEl = document
                .querySelectorAll("#success-notification-content")[0]
                .cloneNode(true) as HTMLElement;
            successEl.classList.remove("hidden");
            Toastify({
                node: successEl,
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
            }).showToast();
        }
    };
    const dropzoneSingleRef = useRef<DropzoneElement>();
    useEffect(() => {
        const elDropzoneSingleRef = dropzoneSingleRef.current;
        if (elDropzoneSingleRef) {
            elDropzoneSingleRef.dropzone.on("success", () => {
                alert("Added file.");
            });
            elDropzoneSingleRef.dropzone.on("error", () => {
                alert("No more files please!");
            });
        }
    }, []);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const onUploadClick = async () => {
        if (!selectedFile) {
            alert('Please select a file first');
            return;
        }

        // Get the presigned URL from the backend
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            };
            const response = await axios.get('http://localhost:8000/api/tasks/get_presigned_url/?filename=$' + selectedFile.name, config);
            const presignedUrl = response.data.presigned_url;
            console.log(selectedFile.type);
            // Upload the file to the presigned URL
            await axios.put(presignedUrl, selectedFile, {
                headers: {
                    'Content-Type': selectedFile.type
                }
            });
            alert('File uploaded successfully');
        } catch (error) {
            console.error('Error uploading the file:', error);
            alert('Error uploading the file');
        }
    };
    // useEffect(() => {
    //     const elDropzoneSingleRef = dropzoneSingleRef.current;
    //     if (elDropzoneSingleRef) {
    //         console.log("Dropzone ref exists.");
    //         elDropzoneSingleRef.dropzone.on("addedfile", async (file:any) => {
    //             try {
    //                 const config = {
    //                     headers: {
    //                         'Content-Type': 'application/json',
    //                     },
    //                     withCredentials: true,
    //                 };
    //                 // Fetch pre-signed URL from Django backend
    //                 const response = await axios.get(`http://localhost:8000/api/tasks/get_presigned_url/?filename=${file.name}`, config);
                    
    //                 // Check if the response contains the expected data
    //                 if (response.data && response.data.presigned_url) {
    //                     const presignedUrl = response.data.presigned_url;
    //                     elDropzoneSingleRef.dropzone.options.url = presignedUrl;
    //                     elDropzoneSingleRef.dropzone.processFile(file);
    //                 } else {
    //                     console.error("Invalid response from the server");
    //                 }
    //             } catch (error) {
    //                 console.error("Error fetching pre-signed URL:", error);
    //             }
    //         });
    
    //         elDropzoneSingleRef.dropzone.on("success", (file, response) => {
    //             console.log("File uploaded successfully:", file, response);
    //         });
    
    //         elDropzoneSingleRef.dropzone.on("error", (file, error, xhr) => {
    //             console.error("File upload failed:", file, error, xhr);
    //         });
    //     }
    // }, []);
    
    return (
        <>
            <h2 className="mt-10 text-lg font-medium intro-y">Product Grid</h2>
            <div className="grid grid-cols-12 gap-6 mt-5">
                <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
                    <Button variant="primary" className="mr-2 shadow-md" onClick={(event: React.MouseEvent) => {
                        event.preventDefault();
                        setSuperlargeSlideoverSizePreview(true);
                    }}>
                        Add New Task
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
            <Slideover
                size="xl"
                open={superlargeSlideoverSizePreview}
                onClose={() => {
                    setSuperlargeSlideoverSizePreview(false);
                }}
            >
                <Slideover.Panel>
                    <Slideover.Title className="p-5">
                        <h2 className="mr-auto text-base font-medium">
                            Create A Task
                        </h2>
                    </Slideover.Title>
                    <Slideover.Description>
                        <div>
                            <div className="input-form">
                                <FormLabel
                                    htmlFor="validation-form-1"
                                    className="flex flex-col w-full sm:flex-row"
                                >
                                    Title
                                    <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                        Required, at least 2 characters
                                    </span>
                                </FormLabel>
                                <FormInput
                                    {...register("name")}
                                    id="validation-form-1"
                                    type="text"
                                    name="name"
                                    className={clsx({
                                        "border-danger": errors.name,
                                    })}
                                    placeholder="Gonna be No. 1 in Youtube"
                                />
                                {errors.name && (
                                    <div className="mt-2 text-danger">
                                        {typeof errors.name.message === "string" &&
                                            errors.name.message}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mt-3 input-form">
                            <FormLabel
                                htmlFor="validation-form-6"
                                className="flex flex-col w-full sm:flex-row"
                            >
                                Description
                                <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                    Required, at least 10 characters
                                </span>
                            </FormLabel>
                            <FormTextarea
                                {...register("comment")}
                                id="validation-form-6"
                                name="comment"
                                className={clsx({
                                    "border-danger": errors.comment,
                                })}
                                placeholder="Type your comments"
                            ></FormTextarea>
                            {errors.comment && (
                                <div className="mt-2 text-danger">
                                    {typeof errors.comment.message === "string" &&
                                        errors.comment.message}
                                </div>
                            )}
                        </div>
                        <div className="mt-3">
                            <FormLabel htmlFor="modal-form-4">
                                Keywords
                            </FormLabel>
                            <FormInput
                                id="modal-form-4"
                                type="text"
                                placeholder="Job, Work, Documentation"
                            />
                        </div>
                        <div className="mt-3">
                            <FormLabel htmlFor="modal-form-4">
                                Thumbnail
                            </FormLabel>
                            <Dropzone
                                getRef={(el) => {
                                    dropzoneSingleRef.current = el;
                                }}
                                options={{
                                    url: "https://httpbin.org/post",
                                    thumbnailWidth: 150,
                                    maxFilesize: 0.5,
                                    maxFiles: 1,
                                    headers: { "My-Awesome-Header": "header value" },
                                }}
                                className="dropzone"
                            >
                                <div className="text-lg font-medium">
                                    Drop files here or click to upload.
                                </div>
                                <div className="text-gray-600">
                                    This is just a demo dropzone. Selected files are
                                    <span className="font-medium">not</span> actually
                                    uploaded.
                                </div>
                            </Dropzone>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <input type="file" onChange={onFileChange} />
                            <button onClick={onUploadClick} style={{ margin: '10px' }}>
                                Upload
                            </button>
                        </div>
                        <div className="mt-3">
                            <FormLabel htmlFor="modal-form-6">Size</FormLabel>
                            <FormSelect id="modal-form-6">
                                <option>10</option>
                                <option>25</option>
                                <option>35</option>
                                <option>50</option>
                            </FormSelect>
                        </div>
                    </Slideover.Description>
                    <Slideover.Footer>
                        <Button
                            variant="outline-secondary"
                            type="button"
                            onClick={() => {
                                setSuperlargeSlideoverSizePreview(false);
                            }}
                            className="w-20 mr-1"
                        >
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" className="mt-5">
                            Save
                        </Button>
                    </Slideover.Footer>
                </Slideover.Panel>
            </Slideover>
            {/* END: Delete Confirmation Modal */}
            {/* BEGIN: Success Notification Content */}
            <Notification
                id="success-notification-content"
                className="flex"
            >
                <Lucide icon="CheckCircle" className="text-success" />
                <div className="ml-4 mr-4">
                    <div className="font-medium">Registration success!</div>
                    <div className="mt-1 text-slate-500">
                        Please check your e-mail for further info!
                    </div>
                </div>
            </Notification>
            {/* END: Success Notification Content */}
            {/* BEGIN: Failed Notification Content */}
            <Notification
                id="failed-notification-content"
                className="flex"
            >
                <Lucide icon="XCircle" className="text-danger" />
                <div className="ml-4 mr-4">
                    <div className="font-medium">Registration failed!</div>
                    <div className="mt-1 text-slate-500">
                        Please check the fileld form.
                    </div>
                </div>
            </Notification>
            {/* END: Failed Notification Content */}
        </>
    );
}

export default Main;
