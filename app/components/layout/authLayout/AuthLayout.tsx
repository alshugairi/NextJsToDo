
const AuthLayout =({children}:any)=>{
    return(
        <>
            <div className="container">
                <div className="auth-page mt-100">
                    <div className="row">
                        <div className="col-md-3"></div>
                        <div className="col-md-6">
                            <div className="rounded p-5 border-blue">
                                {children}
                            </div>
                        </div>
                        <div className="col-md-3"></div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default AuthLayout