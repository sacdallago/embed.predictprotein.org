import create from "zustand";
import { InputAlphabet, InputType } from "../utils/sequence";

// define the store

const useInputStore = create((set) => ({
    input: "",
    inputType: InputType.invalid,
    inputAlphabet: InputAlphabet.undefined,
    isValid: false,
    setInput: (new_input) => set((state) => ({ input: new_input })),
    setValidation: (type, alphabet) =>
        set((state) => ({
            inputType: type,
            inputAlphabet: alphabet,
            isValid: type !== InputType.invalid,
        })),
}));

export default useInputStore;
