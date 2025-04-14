const CustomInput=({formik,name,icon,placeholder,type,className}:any)=>{
    return(
        <div className={className ?? className}>
            <div className="input-group input-group-md mt-3">
                                    <span className="input-group-text" id="Password">
                                        <i className={icon}></i>
                                    </span>
                <input
                    type={type}
                    name={name}
                    className="form-control"
                    placeholder={placeholder}
                    aria-label={type}
                    aria-describedby={name}
                    value={formik.values[name]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
            </div>
            {formik.touched[name] && formik.errors[name] && (
                <div className="text-danger">{formik.errors[name]}</div>
            )}
        </div>
    )
}
export default CustomInput