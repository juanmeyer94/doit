"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableItemProps {
    id: string;
    children: React.ReactNode;
    onDelete: (id: string) => void;
}

export const SortableItem: React.FC<SortableItemProps> = ({ id, children, onDelete }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        border: "1px solid black",
        padding: "10px",
        margin: "5px",
        backgroundColor: "#f4f4f4",
        cursor: "grab",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <span>{children}</span>
            <button
                onClick={() => {
                    onDelete(id);
                    console.log("se hizo click")
                }}
                style={{
                    marginLeft: "10px",
                    padding: "5px 10px",
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    zIndex: 50,
                }}
            >
                Eliminar
            </button>
        </div>
    );
};
