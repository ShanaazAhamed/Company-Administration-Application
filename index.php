<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Company Directory</title>

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="libs/css/bootstrap.min.css">

    <link rel="stylesheet" href="libs/css/style.css">

    <link rel="icon" href="libs/img/fev.png" type="image/png">
</head>

<body>
    <div id="loader">
    </div>
    <div class="container mt-3">
        <ul class="nav nav-tabs justify-content-center mt-2">
            <li class="nav-item">
                <a type="button" id="nav-link-emp" class="nav-link active">Employees</a>
            </li>
            <li class="nav-item">
                <a type="button" id="nav-link-dept" class="nav-link">Departments</a>
            </li>
            <li class="nav-item">
                <a type="button" id="nav-link-loc" class="nav-link">Locations</a>
            </li>
        </ul>
    </div>
    <div class="container mt-2 mb-2">
        <div class="col">
            <button type="button" id="newEmpButton" class="new btn btn-success btn-sm mb-3 mt-2" data-bs-toggle="modal" data-bs-target="#UpdateEmployee">&#10011; Add
                a new employee </button>
            <button type="button" id="newDeptButton" class="new btn btn-success btn-sm mb-3 mt-2" data-bs-toggle="modal" data-bs-target="#DepartmentModal">&#10011; Add
                a new department</button>
            <button type="button" id="newLocButton" class="new btn btn-success btn-sm mb-3 mt-2" data-bs-toggle="modal" data-bs-target="#locationModal">&#10011; Add
                a new location</button>
        </div>
    </div>

    <div class="container">
        <div class="row justify-content-center">
            <div class="col-3 mt-1">
                <span class="badge rounded-pill bg-info text-dark position-relative">Records
                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" id="total">
                    </span>
                </span>
            </div>
            <div class="col-6 mt-1">
                <div class="input-group mb-2 input-group-sm">
                    <input type="text" class="form-control" placeholder="search" aria-label="Recipient's username" aria-describedby="button-addon2" id="searchText">
                </div>
            </div>
            <div class="col-3 mt-1" id="filter-dept">
                <div class="btn-group-sm  mb-2 btn-group">
                    <select id="inputDepartment-drop" class="form-control form-control-sm inputDepartment" required>
                        <option selected value="">All Departments</option>
                    </select>
                </div>
            </div>
            <div class="col-3 mt-1" id="filter-loc">
                <div class="btn-group-sm  mb-2 btn-group">
                    <select id="inputLoc-drop" class="form-control inputLocation form-control-sm" required>
                        <option selected value="">All Locations</option>
                    </select>
                </div>
            </div>
        </div>
    </div>


    <div class="container tableFixHead">
        <table class="table table-hover">
            <thead id="table-head">
            </thead>
            <tbody id="table-body">
            </tbody>
        </table>
    </div>

    <form id="UpdateEmployeeForm" action="javascript:void(0)" class="needs-validation" novalidate>
        <div class="modal fade" id="UpdateEmployee" tabindex="-1" role="dialog" aria-labelledby="employeeModalTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="employeeModalTitle">Employee Details</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="row mt-2">
                            <div class="col-md-6">
                                <label for="firstname-update" class="form-label">First Name</label>
                                <input type="text" class="form-control" id="firstname-update" placeholder="First Name" required>
                                <div class="valid-feedback">
                                    Looks good!
                                </div>
                            </div>
                            <div class="col-md-6">
                                <label for="lastname-update" class="form-label">Last Name</label>
                                <input type="text" class="form-control" id="lastname-update" placeholder="last Name" required>
                                <div class="valid-feedback">
                                    Looks good!
                                </div>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-md-12">
                                <label for="email-update" class="form-label">Email</label>
                                <input type="email" class="form-control" id="email-update" placeholder="Email" required>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-md-6">
                                <label for="jobtitle" class="form-label">Job Title</label>
                                <input type="text" class="form-control" id="jobtitle-update" placeholder="Job Title">
                            </div>
                            <div class="col-md-6">
                                <label for="inputDepartment-update" class="form-label">Department</label>
                                <select id="inputDepartment-update" class="form-control inputDepartment inputDepartments" required>
                                    <option selected disabled value="">Choose...</option>
                                </select>
                                <div class="invalid-feedback">
                                    Please select a valid Department.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" id="deleteEmp">Delete</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" id="editEmp">Edit</button>
                        <button type="submit" class="btn btn-primary" id="SubmitEmp">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    </form>

    <form id="DepartmentForm" action="javascript:void(0)" class="needs-validation" novalidate>
        <div class="modal fade" id="DepartmentModal" tabindex="-1" role="dialog" aria-labelledby="ModalDepartmentTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="ModalDepartmentTitle"></h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <label for="deptname-edit" class="form-label">Name</label>
                                <input type="text" class="form-control" id="deptname-edit" placeholder="Department Name" required>
                            </div>
                            <div class="col-md-6">
                                <label for="inputLocation-edit" class="form-label">Location</label>
                                <select id="inputLocation-edit" class="form-control inputLocation  inputLocations" required>
                                    <option selected disabled value="">Choose...</option>
                                </select>
                                <div class="invalid-feedback">
                                    Please select a valid location.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" id="delDept">Delete</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary" id="submitDept">Submit</button>
                        <button type="submit" class="btn btn-primary" id="editDept">Edit</button>
                    </div>
                </div>
            </div>
        </div>
    </form>

    <form id="LocationForm" action="javascript:void(0)" class="needs-validation" novalidate>
        <div class="modal fade" id="locationModal" tabindex="-1" role="dialog" aria-labelledby="ModalEditLocationTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="ModalEditLocationTitle">Edit Location</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-row">
                            <div class="form-group mx-auto">
                                <label for="location-edit">Location Name</label>
                                <input type="text" class="form-control" id="location-edit" placeholder="Location Name" required>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" id="delLoc">Delete</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" id="editLoc">Edit</button>
                        <button type="submit" class="btn btn-primary" id="submitLoc">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    </form>


    <div class="modal fade message" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-dialog-centered modal-sm">
            <div class="modal-content">
                <div class="modal-body ">
                    <p class="text-white msg text-center"></p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary msgClose" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade delMessage" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-dialog-centered modal-sm">
            <div class="modal-content">
                <div class="modal-body">
                    <p>Are You Sure?</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary msgDelete" data-bs-dismiss="modal">No</button>
                    <button type="button" class="btn btn-danger msgDelete">Yes</button>
                </div>
            </div>
        </div>
    </div>


    <script src="libs/js/jquery-2.2.3.min.js"></script>
    <script src="libs/js/bootstrap.bundle.js"></script>
    <script src="libs/js/main.js"></script>
</body>

</html>