import { Input } from "../ui/input"; // import Input component for text and default input fields
import { Label } from "../ui/label"; // import Label component to display field labels
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"; // import Select components for dropdowns
import { Textarea } from "../ui/textarea"; // import Textarea component for multi-line text input
import { Button } from "../ui/button"; // import Button component for form submission

// create a component for rendering a dynamic form that takes these props: formControls (array of field definitions), formData (object of current values), setFormData (function to update values), onSubmit (function to handle form submission), buttonText (string for submit button label), isBtnDisabled (boolean to disable submit button)
function CommonForm({
    formControls, // array defining each form control with type, name, label, options, etc.
    formData, // object storing current values of form fields
    setFormData, // function to update formData
    onSubmit, // function to handle form submission
    buttonText, // optional text for the submit button
    isBtnDisabled, // boolean to disable submit button if true
}) {
    function renderInputsByComponentType(getControlItem) { // render correct input component based on componentType
        let element = null;
        const value = formData[getControlItem.name] || ""; // get current value of the field from formData

        switch (getControlItem.componentType) { // choose component type to render
            case "input":
                element = (
                    <Input
                        name={getControlItem.name}
                        placeholder={getControlItem.placeholder}
                        id={getControlItem.name}
                        type={getControlItem.type}
                        value={value}
                        onChange={(event) =>
                            setFormData({
                                ...formData, // keep previous formData
                                [getControlItem.name]: event.target.value, // update current field value
                            })
                        }
                    />
                );
                break;
            case "select":
                element = (
                    <Select
                        onValueChange={(value) =>
                            setFormData({
                                ...formData, // keep previous formData
                                [getControlItem.name]: value, // update current field value
                            })
                        }
                        value={value} // set current selected value
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={getControlItem.label} /> {/* display placeholder */}
                        </SelectTrigger>
                        <SelectContent>
                            {getControlItem.options && getControlItem.options.length > 0
                                ? getControlItem.options.map((optionItem) => ( // map through options to render SelectItem
                                    <SelectItem key={optionItem.id} value={optionItem.id}>
                                        {optionItem.label}
                                    </SelectItem>
                                ))
                                : null}
                        </SelectContent>
                    </Select>
                );
                break;
            case "textarea":
                element = (
                    <Textarea
                        name={getControlItem.name}
                        placeholder={getControlItem.placeholder}
                        id={getControlItem.id}
                        value={value}
                        onChange={(event) =>
                            setFormData({
                                ...formData, // keep previous formData
                                [getControlItem.name]: event.target.value, // update current field value
                            })
                        }
                    />
                );
                break;
            default:
                element = (
                    <Input
                        name={getControlItem.name}
                        placeholder={getControlItem.placeholder}
                        id={getControlItem.name}
                        type={getControlItem.type}
                        value={value}
                        onChange={(event) =>
                            setFormData({
                                ...formData, // keep previous formData
                                [getControlItem.name]: event.target.value, // update current field value
                            })
                        }
                    />
                );
                break;
        }

        return element; // return the rendered input element
    }

    return (
        <form onSubmit={onSubmit}> {/* attach onSubmit handler */}
            <div className="flex flex-col gap-3">
                {formControls.map((controlItem) => ( // map through formControls to render each field
                    <div className="grid w-full gap-1.5" key={controlItem.name}>
                        <Label className="mb-1">{controlItem.label}</Label> {/* display field label */}
                        {renderInputsByComponentType(controlItem)} {/* render input component dynamically */}
                    </div>
                ))}
            </div>
            <Button disabled={isBtnDisabled} type="submit" className="mt-2 w-full">
                {buttonText || "Submit"}
            </Button>
        </form>
    );
}

export default CommonForm;
