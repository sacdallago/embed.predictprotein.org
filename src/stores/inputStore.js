import create from "zustand";
import { InputAlphabet, InputType, eval_input_type } from "../utils/sequence";

// define the store

const invalid = {
    sequence: undefined,
    inputType: InputType.invalid,
    inputAlphabet: InputAlphabet.undefined,
    isValid: false,
};

const initial = {
    input: "",
    ...invalid,
};

const useInputStore = create((set) => ({
    ...initial,
    setInput: (new_input) =>
        set((state) => {
            state.invalidate();
            return { input: new_input };
        }),
    validate: () =>
        set((state) => {
            let [type, alphabet] = eval_input_type(state.input);
            return {
                inputType: type,
                inputAlphabet: alphabet,
                isValid: type !== InputType.invalid,
            };
        }),
    setSequence: (new_sequence) =>
        set((state) => ({
            sequence: new_sequence,
        })),
    reset: () => set(initial),
    invalidate: () => set(invalid),
}));

export default useInputStore;
