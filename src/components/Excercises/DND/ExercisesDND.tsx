"use client";

import { useState } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItems";
import { DataInterface } from "@/interfaces/data.interface";

interface ExercisesDNDProps {
    typeOfExercises: string[];
    setData: React.Dispatch<React.SetStateAction<DataInterface>>;
}

const ExercisesDND: React.FC<ExercisesDNDProps> = ({ typeOfExercises, setData }) => {
    const [newExercise, setNewExercise] = useState<string>("");

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, 
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );
    

    const handleAddExercise = (e: React.FormEvent) => {
        e.preventDefault();
        if (newExercise.trim() === "") return;

        setData((prevData) => ({
            ...prevData,
            typeOfExercises: [...prevData.typeOfExercises, newExercise.trim()],
        }));

        setNewExercise("");
    };

    const handleDeleteExercise = (id: string) => {
        setData((prevData) => ({
            ...prevData,
            typeOfExercises: prevData.typeOfExercises.filter((exercise) => exercise !== id),
        }));
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active && over && active.id !== over.id) {
            setData((prevData) => {
                const oldIndex = prevData.typeOfExercises.indexOf(active.id as string);
                const newIndex = prevData.typeOfExercises.indexOf(over.id as string);

                return {
                    ...prevData,
                    typeOfExercises: arrayMove(prevData.typeOfExercises, oldIndex, newIndex),
                };
            });
        }
    };

    return (
        <div>
            <h1>Ejercicios</h1>
            <form onSubmit={handleAddExercise} style={{ marginBottom: "20px" }}>
                <input
                    type="text"
                    value={newExercise}
                    onChange={(e) => setNewExercise(e.target.value)}
                    placeholder="Agregar un nuevo ejercicio"
                    style={{ padding: "8px", marginRight: "10px" }}
                />
                <button type="submit" style={{ padding: "8px 16px" }}>
                    Agregar
                </button>
            </form>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={typeOfExercises} strategy={verticalListSortingStrategy}>
                    {typeOfExercises.map((exercise) => (
                        <SortableItem key={exercise} id={exercise} onDelete={handleDeleteExercise}>
                            {exercise}
                            
                        </SortableItem>
                    ))}
                </SortableContext>
            </DndContext>
        </div>
    );
};

export default ExercisesDND;
