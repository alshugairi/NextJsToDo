import React from "react";

const CustomFileInput = ({ formik, name, label, maxSizeMB,className }:any) => {
    return (
        <div className={className}>
<div style={{border:"2px dashed  #ccc"}} className="  rounded-lg p-3 my-3 text-center relative">
<label
                    htmlFor={name}
                    className="block cursor-pointer"
                >
                    <div className="flex flex-col items-center justify-center space-y-2">
                        <i className="fas fa-upload text-blue-500 text-2xl"></i>
                        <p className="text-gray-600 font-medium">{label}</p>
                        <p className="text-sm text-gray-400  m-0">
                            File must be under {maxSizeMB} MB in size
                        </p>
                    </div>
                    <input
                        id={name}
                        name={name}
                        type="file"
                        accept="image/*"
                        onChange={(event:any) => {
                            formik.setFieldValue(name, event.currentTarget.files[0]);
                        }}
                        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer d-none"
                    />
                </label>
                {formik.touched[name] && formik.errors[name] && (
                    <p className="text-red-500 text-sm ">{formik.errors[name]}</p>
                )}
            </div>
        </div>

    );
};

export default CustomFileInput;
