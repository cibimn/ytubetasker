import _ from "lodash";
import clsx from "clsx";
import Button from "../../base-components/Button";
import Pagination from "../../base-components/Pagination";
import { FormLabel, FormInput, FormSelect, FormCheck } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import { Dialog } from "../../base-components/Headless";
import React, { useEffect, useState, useRef, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import Table from "../../base-components/Table";
import Tippy from "../../base-components/Tippy";
import defaultprofile from "../../assets/images/fakers/profile-1.jpg";
import Notification, { NotificationElement } from "../../base-components/Notification";
import { Options } from "toastify-js";

function Main() {
    interface CustomOptions extends Options {
        status?: "success" | "failure";
    }
    const [editors, setEditors] = useState<Editor[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [notificationOptions, setNotificationOptions] = useState<CustomOptions | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: ''
    });
    const notificationRef = useRef<NotificationElement | null>(null);

    useEffect(() => {
        if (notificationOptions && notificationRef.current) {
            notificationRef.current.options = notificationOptions;
            notificationRef.current.showToast();
        }
    }, [notificationOptions]);
    const [errors, setErrors] = useState({
        first_name: false,
        last_name: false,
        email: false,
    });

    // Validate form fields
    const validateForm = () => {
        console.log("Form Data", formData);
        let newErrors = {
            first_name: !formData.first_name,
            last_name: !formData.last_name,
            email: !formData.email,
        };
        console.log("New Errors", newErrors);
        setErrors(newErrors);
        return !newErrors.first_name && !newErrors.last_name && !newErrors.email;
    };

    const addEditor = () => {
        if (!validateForm()) {
            return;
        };
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        };

        axios.post('http://localhost:8000/api/users/add_editor/', formData, config)
            .then(response => {
                // console.log("Editor added successfully", response);
                setModalOpen(false);
                setNotificationOptions({
                    text: "Editor added successfully",
                    duration: 10000,  // 10 seconds
                    status: "success"
                    // other Toastify options you want
                });
                fetchEditors();
            })
            .catch(error => {
                // console.error("There was an error adding the editor", error);
                let errorMessage = "An unknown error occurred";
                if (error.response && error.response.data) {
                    if (error.response.data.email && Array.isArray(error.response.data.email)) {
                        errorMessage = "Editor Email is already added.";
                    } else {
                        errorMessage = error.response.data.detail || error.response.data.message || JSON.stringify(error.response.data);
                    }
                }
                setNotificationOptions({
                    text: errorMessage,
                    duration: 10000,  // 10 seconds
                    status: "failure"
                    // other Toastify options you want
                });
            });
    };
    // delete
    const [editorToDelete, setEditorToDelete] = useState<string | null>(null);

    const handleDeleteClick = (email:string) => {
        setEditorToDelete(email);
        setDeleteConfirmationModal(true);
    };
    const removeEditor = () => {
        console.log(editorToDelete);
        if (editorToDelete){const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        };
        let deletedata = {"email":editorToDelete};
        axios
            .post(`http://localhost:8000/api/users/remove_editor/`,deletedata, config) // Removed email from URL
            .then((response) => {
                console.log("Editor removed successfully", response);
                setNotificationOptions({
                    text: "Editor removed successfully",
                    duration: 10000,
                    status: "success",
                });
                fetchEditors(); // Refetch the editors list
            })
            .catch((error) => {
                console.error("There was an error removing the editor", error);
                setNotificationOptions({
                    text: "An error occurred while removing the editor",
                    duration: 10000,
                    status: "failure",
                });
            });}
            setDeleteConfirmationModal(false);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    interface Editor {
        first_name: string;
        last_name: string;
        email: string;
        is_active: boolean;
        image: string;  // Replace with the correct type if different
    }
    const fetchEditors = () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        };

        axios.get(`http://localhost:8000/api/users/list_editors/`, config)
            .then(response => {
                setEditors(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching data', error);
            });
    };
    useEffect(() => {
        fetchEditors();
    }, []);

    const handleEntriesPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setEntriesPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    // search
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredEditors, setFilteredEditors] = useState<Editor[]>([]);

    useEffect(() => {
        const results = editors.filter(editor =>
            editor.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            editor.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            editor.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredEditors(results);
    }, [editors, searchTerm]);
    

    const totalEntries = editors.length;
    // const start = (currentPage - 1) * entriesPerPage;
    // const end = Math.min(start + entriesPerPage, totalEntries);
    // const displayedEditors = editors.slice(start, end);  // This line was updated
    const totalFilteredEntries = filteredEditors.length;
    const start = (currentPage - 1) * entriesPerPage;
    const end = Math.min(start + entriesPerPage, totalFilteredEntries);
    const displayedEditors = filteredEditors.slice(start, end);
    const totalPages = Math.ceil(totalEntries / entriesPerPage);

    const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
    const deleteButtonRef = useRef(null);

    return (
        <>
            <h2 className="mt-10 text-lg font-medium intro-y">Users Layout</h2>
            <div className="grid grid-cols-12 gap-6 mt-5">
                <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
                    <Button variant="primary" className="mr-2 shadow-md" onClick={() => setModalOpen(true)}>
                        Add New User
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
                <div className="col-span-12 overflow-auto intro-y 2xl:overflow-visible">
                    <Table className="border-spacing-y-[10px] border-separate -mt-2">
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th className="border-b-0 whitespace-nowrap">
                                    Editor
                                </Table.Th>
                                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                                    STATUS
                                </Table.Th>
                                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                                    TOTAL Videos
                                </Table.Th>
                                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                                    TOTAL Paid
                                </Table.Th>
                                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                                    ACTIONS
                                </Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {displayedEditors.map((editor, index) => (
                                <Table.Tr key={index} className="intro-x">
                                    <Table.Td className="first:rounded-l-md last:rounded-r-md !py-3.5 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                        <div className="flex items-center">
                                            <div className="w-9 h-9 image-fit zoom-in">
                                                {editor.image ? (
                                                    <Tippy
                                                        as="img"
                                                        alt={editor.first_name}
                                                        className="border-white rounded-lg shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                                                        src={editor.image}
                                                    />
                                                ) : (
                                                    <Tippy
                                                        as="img"
                                                        alt={editor.first_name}
                                                        className="border-white rounded-lg shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                                                        src={defaultprofile}
                                                    />
                                                )}

                                            </div>
                                            <div className="ml-4">
                                                <a href="" className="font-medium whitespace-nowrap">
                                                    {editor.first_name} {editor.last_name}
                                                </a>
                                                <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                                                    {editor.email}
                                                </div>
                                            </div>
                                        </div>
                                    </Table.Td>

                                    <Table.Td className="first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                        <div
                                            className={clsx([
                                                "flex items-center justify-center",
                                                { "text-success": editor.is_active },
                                                { "text-danger": !editor.is_active },
                                            ])}
                                        >
                                            <Lucide icon="CheckSquare" className="w-4 h-4 mr-2" />
                                            {editor.is_active ? "Active" : "Inactive"}
                                        </div>
                                    </Table.Td>
                                    <Table.Td className="first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                        <div
                                            className={clsx([
                                                "flex items-center justify-center",
                                                { "text-success": editor.is_active },
                                                { "text-danger": !editor.is_active },
                                            ])}
                                        >
                                            <Lucide icon="CheckSquare" className="w-4 h-4 mr-2" />
                                            {editor.is_active ? "Active" : "Inactive"}
                                        </div>
                                    </Table.Td>
                                    <Table.Td className="first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                        <div
                                            className={clsx([
                                                "flex items-center justify-center",
                                                { "text-success": "true" },
                                                { "text-danger": !"false" },
                                            ])}
                                        >
                                            <Lucide icon="CheckSquare" className="w-4 h-4 mr-2" />
                                            {"true" ? "Active" : "Inactive"}
                                        </div>
                                    </Table.Td>
                                    <Table.Td className="first:rounded-l-md last:rounded-r-md w-56 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                                        <div className="flex items-center justify-center">
                                            {/* <a className="flex items-center mr-3" href="#">
                                                <Lucide icon="CheckSquare" className="w-4 h-4 mr-1" />{" "}
                                                Edit
                                            </a> */}
                                            <a
                                                className="flex items-center text-danger"
                                                href="#"
                                                onClick={() => {
                                                    handleDeleteClick(editor.email);
                                                    setDeleteConfirmationModal(true);
                                                }}
                                            >
                                                <Lucide icon="Trash2" className="w-4 h-4 mr-1" /> Delete
                                            </a>
                                        </div>
                                    </Table.Td>
                                </Table.Tr>
                            ))}

                        </Table.Tbody>
                    </Table>
                </div>

                {/* BEGIN: Users Layout */}
                {/* END: Pagination */}
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
            <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
                <Dialog.Panel>
                    <Dialog.Title>
                        <h2 className="mr-auto text-base font-medium">Add Editor</h2>
                    </Dialog.Title>
                    <Dialog.Description className="grid grid-cols-12 gap-4 gap-y-3">
                        <div className="col-span-12 sm:col-span-6">
                            <FormLabel htmlFor="modal-form-1">First Name</FormLabel>
                            <FormInput
                                name="first_name"
                                type="text"
                                onChange={handleChange}
                                placeholder=""
                                className={errors.first_name ? "border-red-500" : ""}
                            />
                        </div>
                        <div className="col-span-12 sm:col-span-6">
                            <FormLabel htmlFor="modal-form-2">Last Name</FormLabel>
                            <FormInput
                                name="last_name"
                                type="text"
                                onChange={handleChange}
                                placeholder=""
                                className={errors.last_name ? "border-red-500" : ""}
                            />
                        </div>
                        <div className="col-span-12 sm:col-span-6">
                            <FormLabel htmlFor="modal-form-2">Email</FormLabel>
                            <FormInput
                                name="email"
                                type="text"
                                onChange={handleChange}
                                placeholder="example@gmail.com"
                                className={errors.email ? "border-red-500" : ""}
                            />
                        </div>
                    </Dialog.Description>
                    <Dialog.Footer>
                        <Button
                            type="button"
                            variant="outline-secondary"
                            onClick={() => setModalOpen(false)}
                            className="w-20 mr-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            type="button"
                            className="w-20"
                            onClick={addEditor}
                        >
                            Add
                        </Button>
                    </Dialog.Footer>
                </Dialog.Panel>
            </Dialog>
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
                            onClick={()=>{
                                removeEditor();
                            }}
                        >
                            Delete
                        </Button>
                    </div>
                </Dialog.Panel>
            </Dialog>
            <Notification
                options={notificationOptions || {}}
                getRef={el => notificationRef.current = el}
                className="flex"
            >
            </Notification>
        </>
    );
}

export default Main;
