"use client";

import { useState, useEffect } from "react";
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
    const [exercises, setExercises] = useState<string[]>(typeOfExercises);

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

    useEffect(() => {
        const cachedExercises = localStorage.getItem('exercises');
        if (cachedExercises) {
            const parsedExercises = JSON.parse(cachedExercises);
            setExercises(parsedExercises);
            setData(prevData => ({
                ...prevData,
                typeOfExercises: parsedExercises,
            }));
        }
    }, [setData]);

    const handleAddExercise = (e: React.FormEvent) => {
        e.preventDefault();
        if (newExercise.trim() === "") return;

        const updatedExercises = [...exercises, newExercise.trim()];
        setExercises(updatedExercises);
        setData((prevData) => ({
            ...prevData,
            typeOfExercises: updatedExercises,
        }));
        localStorage.setItem('exercises', JSON.stringify(updatedExercises));

        setNewExercise("");
    };

    const handleDeleteExercise = (id: string) => {
        const updatedExercises = exercises.filter((exercise) => exercise !== id);
        setExercises(updatedExercises);
        setData((prevData) => ({
            ...prevData,
            typeOfExercises: updatedExercises,
        }));
        localStorage.setItem('exercises', JSON.stringify(updatedExercises));
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active && over && active.id !== over.id) {
            const oldIndex = exercises.indexOf(active.id as string);
            const newIndex = exercises.indexOf(over.id as string);

            const updatedExercises = arrayMove(exercises, oldIndex, newIndex);
            setExercises(updatedExercises);
            setData((prevData) => ({
                ...prevData,
                typeOfExercises: updatedExercises,
            }));
            localStorage.setItem('exercises', JSON.stringify(updatedExercises));
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
                <SortableContext items={exercises} strategy={verticalListSortingStrategy}>
                    {exercises.map((exercise) => (
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

