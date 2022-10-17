class Employee {
  constructor(data, head, departments) {
    this.data = data;
    this.head = head;
    this.departments = departments;
  }

  sortByKey(array, key) {
    return array.sort(function (a, b) {
      var x = a[key].toLowerCase();
      var y = b[key].toLowerCase();
      return x < y ? -1 : x > y ? 1 : 0;
    });
  }

  buildTable() {
    let filtred;
    $("tbody").animate({ scrollTop: 0 }, "fast");
    $("#table-body").empty();
    $("#table-head").empty();
    $("#inputDepartment-drop").find("option").not(":first").remove();
    $(".inputDepartments").find("option").not(":first").remove();
    this.head.forEach((row) => {
      $("#table-head").append(
        `<th scope="col" class ="head" id=${row.sort}>${
          row.th
        }<span class="sort">${
          row.sort == this.sortBy ? this.sortOrder : ""
        }</span></th>`
      );
    });

    if (this.currDepartment != "") {
      filtred = this.data.filter(
        (emp) => emp.department == this.currDepartment
      );
    } else {
      filtred = this.data;
    }

    if (this.search != "") {
      filtred = filtred.filter(
        (emp) =>
          emp.firstName.toLowerCase().includes(this.search) ||
          emp.lastName.toLowerCase().includes(this.search)
      );
    }

    filtred.map((row) => {
      $("#table-body").append(`<tr class = "viewEmployee" id=${row.id}>
      <td>${row.firstName}</td>
      <td>${row.lastName}</td>
      <td>${row.department}</td>
    </tr>`);
    });
    this.departments.dropDownDepartments();
    $("#total").html(filtred.length);
    if (this.currDepartment !== "") {
      $("#inputDepartment-drop").val(
        this.departments.getDepartmentByName(this.currDepartment)
      );
    }
    $("#loader").fadeOut(100);
  }

  sortTable(th) {
    $(".sort").hide();
    if (th == this.sortBy) {
      if (this.sortOrder == "&#9662;") {
        this.sortOrder = "&#9652;";
      } else {
        this.sortOrder = "&#9662;";
      }
      this.data.reverse();
    } else {
      this.sortOrder = "&#9662;";
      this.sortByKey(this.data, th);
      this.sortBy = th;
    }
  }

  addEmployee() {
    $("#employeeModalTitle").html("Add a new Employee");
    $("#firstname-update").val("").prop("disabled", false);
    $("#lastname-update").val("").prop("disabled", false);
    $("#email-update").val("").prop("disabled", false);
    $("#jobtitle-update").val("").prop("disabled", false);
    $("#inputDepartment-update").val("").prop("disabled", false);
    $("#SubmitEmp").show();
    $("#deleteEmp").hide();
    $("#editEmp").hide();
    $("#UpdateEmployee").modal("show");
  }

  employeeDetails(id) {
    this.emp = this.data.filter((emp) => emp.id == id)[0];
    $("#employeeModalTitle").html("Employee Details");
    $("#firstname-update").val(this.emp.firstName).prop("disabled", true);
    $("#lastname-update").val(this.emp.lastName).prop("disabled", true);
    $("#email-update").val(this.emp.email).prop("disabled", true);
    $("#jobtitle-update")
      .val(this.emp.jobTitle == "" ? " " : this.emp.jobTitle)
      .prop("disabled", true);
    $("#inputDepartment-update")
      .val(this.departments.getDepartmentByName(this.emp.department))
      .prop("disabled", true);
    $("#SubmitEmp").hide();
    $("#deleteEmp").show();
    $("#editEmp").show();
    $("#UpdateEmployee").modal("show");
  }

  editEmployee() {
    $("#employeeModalTitle").html("Edit Employee");
    $("#firstname-update").prop("disabled", false);
    $("#lastname-update").prop("disabled", false);
    $("#email-update").prop("disabled", false);
    $("#jobtitle-update").prop("disabled", false);
    $("#inputDepartment-update").prop("disabled", false);
    $("#deleteEmp").hide();
    $("#addEmp").hide();
    $("#editEmp").hide();
    $("#SubmitEmp").show();
  }

  submitEmployee() {
    let form = $("#UpdateEmployeeForm");
    let data, url;
    if ($("#employeeModalTitle").html() == "Add a new Employee") {
      data = {
        firstName: $("#firstname-update").val(),
        lastName: $("#lastname-update").val(),
        email: $("#email-update").val(),
        jobTitle: $("#jobtitle-update").val(),
        departmentID: $("#inputDepartment-update").val(),
      };
      url = "libs/php/insertPersonnel.php";
    } else {
      let empId = this.emp.id;
      data = {
        id: empId,
        firstName: $("#firstname-update").val(),
        lastName: $("#lastname-update").val(),
        email: $("#email-update").val(),
        jobTitle: $("#jobtitle-update").val(),
        departmentID: $("#inputDepartment-update").val(),
      };
      url = "libs/php/updatePersonnel.php";
    }
    if (form[0].checkValidity()) {
      function submitForm() {
        return $.ajax({
          type: "POST",
          url: url,
          data: data,
          dataType: "json",
        });
      }
      submitForm().success(function (data) {
        $(".msg").removeClass("bg-danger");
        $(".msg").addClass("bg-success");
        $(".msg").html("Successfully updated");
        $("#UpdateEmployee").modal("hide");
        $(".message").modal("show");
        $("#loader").show().css("opacity", 0.5);
        setTimeout(loadAllDetails, 100);
      });
    }
    $(form).addClass("was-validated");
  }

  deleteEmployee() {
    $(".delMessage").modal("show");
    let empId = this.emp.id;
    $(".msgDelete").click(function (e) {
      if ($(this).html() == "Yes") {
        e.preventDefault();
        function deleteEmp() {
          return $.ajax({
            type: "GET",
            url: "libs/php/deletePersonnelByID.php",
            data: {
              id: empId,
            },
            dataType: "json",
          });
        }
        deleteEmp().success(function (data) {
          $(".delMessage").modal("hide");
          $(".msg").html("Successfully deleted");
          $("#UpdateEmployee").modal("hide");
          $(".message").modal("show");
          if (data["status"]["code"] == 400) {
            $(".msg").addClass("bg-danger");
            $(".msg").removeClass("bg-success");
          } else {
            $(".msg").removeClass("bg-danger");
            $(".msg").addClass("bg-success");
            $("#loader").show().css("opacity", 0.5);
            setTimeout(loadAllDetails, 100);
          }
        });
        deleteEmp().error(function () {
          $(".msg").html("Error Occurs");
          $(".message").modal("show");
        });
      }
    });
  }
}

class Departments {
  constructor(data, head, locations) {
    this.data = data;
    this.head = head;
    this.locations = locations;
  }

  sortByKey(array, key) {
    return array.sort(function (a, b) {
      var x = a[key].toLowerCase();
      var y = b[key].toLowerCase();

      return x < y ? -1 : x > y ? 1 : 0;
    });
  }

  dropDownDepartments() {
    let datas = this.sortByKey(this.data, "name");
    datas.map((dept) => {
      $(".inputDepartment").append(
        `<option value=${dept["id"]}>${dept["name"]}</option>`
      );
    });
  }

  getDepartmentByName(name) {
    return this.data.filter((dept) => dept.name == name)[0].id;
  }

  getDepartmentById(id) {
    return this.data.filter((dept) => dept.id == id)[0].name;
  }

  buildTable() {
    $("tbody").animate({ scrollTop: 0 }, "fast");
    let filtred;
    $("#table-body").empty();
    $("#table-head").empty();
    $("#inputLoc-drop").find("option").not(":first").remove();
    $(".inputLocations").find("option").not(":first").remove();
    this.head.forEach((row) => {
      $("#table-head").append(
        `<th scope="col" class ="head" id=${row.sort}>${
          row.th
        }<span class="sort">${
          row.sort == this.sortBy ? this.sortOrder : ""
        }</span></th>`
      );
    });

    if (this.currLocation != "") {
      filtred = this.data.filter(
        (dept) => dept.locationID == this.currLocation
      );
    } else {
      filtred = this.data;
    }

    if (this.search != "") {
      filtred = filtred.filter((dept) =>
        dept.name.toLowerCase().includes(this.search)
      );
    }

    filtred.map((row) => {
      $("#table-body").append(`<tr class ="viewDepartment" id=${row.id}>
      <td>${row.name}</td>
      <td>${this.locations.getLocationById(row.locationID)}</td>
    </tr>`);
    });

    this.locations.dropDownLocations();
    $("#total").html(filtred.length);
    if (this.currLocation !== "") {
      $("#inputLoc-drop").val(this.currLocation);
    }
    $("#loader").fadeOut(100);
  }

  sortTable(th) {
    $(".sort").hide();
    if (th == this.sortBy) {
      if (this.sortOrder == "&#9662;") {
        this.sortOrder = "&#9652;";
      } else {
        this.sortOrder = "&#9662;";
      }
      this.data.reverse();
    } else {
      this.sortOrder = "&#9662;";
      this.sortByKey(this.data, th);
      this.sortBy = th;
    }
  }

  addDepartment() {
    $("#ModalDepartmentTitle").html("Add a new Department");
    $("#deptname-edit").val("").prop("disabled", false);
    $("#inputLocation-edit").val("").prop("disabled", false);
    $("#submitDept").show();
    $("#editDept").hide();
    $("#delDept").hide();
    $("#DepartmentModal").modal("show");
  }

  departmentDetails(id) {
    this.dept = this.data.filter((dept) => dept.id == id)[0];
    $("#ModalDepartmentTitle").html("Department Details");
    $("#deptname-edit").val(this.dept.name).prop("disabled", true);
    $("#inputLocation-edit").val(this.dept.locationID).prop("disabled", true);
    $("#submitDept").hide();
    $("#editDept").show();
    $("#delDept").show();
    $("#DepartmentModal").modal("show");
  }

  editDepartment() {
    $("#ModalDepartmentTitle").html("Edit Department");
    $("#deptname-edit").prop("disabled", false);
    $("#inputLocation-edit").prop("disabled", false);
    $("#submitDept").show();
    $("#editDept").hide();
    $("#delDept").hide();
  }

  submitDepartment() {
    let form = $("#DepartmentForm");
    let data, url;
    if ($("#ModalDepartmentTitle").html() == "Add a new Department") {
      data = {
        name: $("#deptname-edit").val(),
        locationID: $("#inputLocation-edit").val(),
      };
      url = "libs/php/insertDepartment.php";
    } else {
      let deptId = this.dept.id;
      data = {
        id: deptId,
        name: $("#deptname-edit").val(),
        locationID: $("#inputLocation-edit").val(),
      };
      url = "libs/php/updateDepartment.php";
    }
    if (form[0].checkValidity()) {
      function submitForm() {
        return $.ajax({
          type: "POST",
          url: url,
          data: data,
          dataType: "json",
        });
      }
      submitForm().success(function (data) {
        // console.log("Department Submitted");
        $(".msg").removeClass("bg-danger");
        $(".msg").addClass("bg-success");
        $(".msg").html("Department successfully updated");
        $("#DepartmentModal").modal("hide");
        $(".message").modal("show");
        $("#loader").show().css("opacity", 0.5);
        setTimeout(loadAllDetails, 100);
      });
    }
    $(form).addClass("was-validated");
  }

  deleteDepartment() {
    let dept = this.dept;
    $("#loader").show().css("opacity", 0.5);
    $.ajax({
      type: "GET",
      url: "libs/php/DepartmentDependency.php",
      data: { id: dept.id },
      dataType: "json",
      async: false,
      success: function (data) {
        $("#loader").fadeOut(100);
        if (data["data"][0]["dependecy"] == 0) {
          $(".delMessage").modal("show");
          $(".msgDelete").click(function (e) {
            if ($(this).html() == "Yes") {
              e.preventDefault();
              function deleteDept() {
                return $.ajax({
                  type: "GET",
                  url: "libs/php/deleteDepartmentByID.php",
                  data: {
                    id: dept.id,
                  },
                  dataType: "json",
                });
              }
              deleteDept().success(function (data) {
                $(".delMessage").modal("hide");
                $("#DepartmentModal").modal("hide");
                $(".message").modal("show");
                if (data["status"]["code"] == 400) {
                  $(".msg").html("Failed");
                  $(".msg").addClass("bg-danger");
                  $(".msg").removeClass("bg-success");
                } else {
                  $(".msg").html("Successfully deleted");
                  $(".msg").removeClass("bg-danger");
                  $(".msg").addClass("bg-success");
                  $("#loader").show().css("opacity", 0.5);
                  setTimeout(loadAllDetails, 100);
                }
              });
              deleteDept().error(function () {
                $(".msg").html("Error Occurs");
                $(".message").modal("show");
              });
            }
          });
        } else {
          $("#DepartmentModal").modal("hide");
          $(".message").modal("show");
          if (data["data"][0]["dependecy"] > 1) {
            $(".msg").html(
              `You cannot delete <b>${dept.name}</b> because there are <b>${data["data"][0]["dependecy"]}</b> personnels assigned to it`
            );
          } else {
            $(".msg").html(
              `You cannot delete <b>${dept.name}</b> because there is <b>${data["data"][0]["dependecy"]}</b> personnel assigned to it`
            );
          }

          $(".msg").addClass("bg-danger");
          $(".msg").removeClass("bg-success");
        }
      },
      error: function () {
        console.log("Eorr");
      },
    });
  }
}

class Locations {
  constructor(data, head) {
    this.data = data;
    this.head = head;
  }
  sortByKey(array, key) {
    return array.sort(function (a, b) {
      var x = a[key].toLowerCase();
      var y = b[key].toLowerCase();

      return x < y ? -1 : x > y ? 1 : 0;
    });
  }
  dropDownLocations() {
    let datas = this.sortByKey(this.data, "name");
    datas.map((loc) => {
      $(".inputLocation").append(
        `<option value=${loc["id"]}>${loc["name"]}</option>`
      );
    });
  }
  getLocationById(id) {
    return this.data.filter((loc) => loc.id == id)[0].name;
  }

  buildTable() {
    $("tbody").animate({ scrollTop: 0 }, "fast");
    let filtred;
    $("#table-body").empty();
    $("#table-head").empty();
    this.head.forEach((row) => {
      $("#table-head").append(
        `<th scope="col" class ="head" id=${row.sort}>${
          row.th
        }<span class="sort">${
          row.sort == this.sortBy ? this.sortOrder : ""
        }</span></th>`
      );
    });

    if (this.search != "") {
      filtred = this.data.filter((dept) =>
        dept.name.toLowerCase().includes(this.search)
      );
    } else {
      filtred = this.data;
    }

    filtred.map((row) => {
      $("#table-body").append(`<tr class ="viewLocation" id=${row.id}>
      <td>${row.name}</td>
    </tr>`);
    });
    $("#total").html(filtred.length);
    $("#loader").fadeOut(100);
  }

  sortTable(th) {
    $(".sort").hide();
    if (th == this.sortBy) {
      if (this.sortOrder == "&#9662;") {
        this.sortOrder = "&#9652;";
      } else {
        this.sortOrder = "&#9662;";
      }
      this.data.reverse();
    } else {
      this.sortOrder = "&#9662;";
      this.sortByKey(this.data, th);
      this.sortBy = th;
    }
  }
  addLocation() {
    $("#ModalEditLocationTitle").html("Add a new Location");
    $("#location-edit").val("").prop("disabled", false);
    $("#submitLoc").show();
    $("#editLoc").hide();
    $("#delLoc").hide();
    $("#locationModal").modal("show");
  }
  locationDetails(id) {
    this.loc = this.data.filter((loc) => loc.id == id)[0];
    $("#ModalEditLocationTitle").html("Location Details");
    $("#location-edit").val(this.loc.name).prop("disabled", true);
    $("#submitLoc").hide();
    $("#editLoc").show();
    $("#delLoc").show();
    $("#locationModal").modal("show");
  }
  editLocation() {
    $("#ModalEditLocationTitle").html("Edit Location");
    $("#location-edit").prop("disabled", false);
    $("#submitLoc").show();
    $("#editLoc").hide();
    $("#delLoc").hide();
  }
  submitLocation() {
    let form = $("#LocationForm");
    let data, url;
    if ($("#ModalEditLocationTitle").html() == "Add a new Location") {
      data = {
        name: $("#location-edit").val(),
      };
      url = "libs/php/insertLocation.php";
    } else {
      let locId = this.loc.id;
      data = {
        id: locId,
        name: $("#location-edit").val(),
      };
      url = "libs/php/updateLocation.php";
    }
    if (form[0].checkValidity()) {
      function submitForm() {
        return $.ajax({
          type: "POST",
          url: url,
          data: data,
          dataType: "json",
        });
      }
      submitForm().success(function (data) {
        $(".msg").removeClass("bg-danger");
        $(".msg").addClass("bg-success");
        $(".msg").html("Location successfully updated");
        $("#locationModal").modal("hide");
        $("#loader").show().css("opacity", 0.5);
        setTimeout(loadAllDetails, 100);
        $(".message").modal("show");
      });
    }
    $(form).addClass("was-validated");
  }
  deleteLocation() {
    $("#loader").show().css("opacity", 0.5);
    let loc = this.loc;
    $.ajax({
      type: "GET",
      url: "libs/php/locationDependency.php",
      data: { id: loc.id },
      dataType: "json",
      async: false,
      success: function (data) {
        $("#loader").fadeOut(100);
        if (data["data"][0]["dependecy"] == 0) {
          $(".delMessage").modal("show");
          $(".msgDelete").click(function (e) {
            if ($(this).html() == "Yes") {
              e.preventDefault();
              function deleteDept() {
                return $.ajax({
                  type: "GET",
                  url: "libs/php/deleteLocationByID.php",
                  data: {
                    id: loc.id,
                  },
                  dataType: "json",
                });
              }
              deleteDept().success(function (data) {
                $(".delMessage").modal("hide");
                $("#locationModal").modal("hide");
                $(".message").modal("show");
                if (data["status"]["code"] == 400) {
                  $(".msg").html("Failed");
                  $(".msg").addClass("bg-danger");
                  $(".msg").removeClass("bg-success");
                } else {
                  $(".msg").html("Successfully deleted");
                  $(".msg").removeClass("bg-danger");
                  $(".msg").addClass("bg-success");
                  $("#loader").show().css("opacity", 0.5);
                  setTimeout(loadAllDetails, 100);
                }
              });
              deleteDept().error(function () {
                $(".msg").html("Error Occurs");
                $(".message").modal("show");
              });
            }
          });
        } else {
          $("#locationModal").modal("hide");
          $(".message").modal("show");
          if (data["data"][0]["dependecy"] > 1) {
            $(".msg").html(
              `You cannot delete <b>${loc.name}</b> because there are <b>${data["data"][0]["dependecy"]}</b> departments assigned to it`
            );
          } else {
            $(".msg").html(
              `You cannot delete <b>${loc.name}</b> because there is <b>${data["data"][0]["dependecy"]}</b> department assigned to it`
            );
          }

          $(".msg").addClass("bg-danger");
          $(".msg").removeClass("bg-success");
        }
      },
      error: function () {
        console.log("Eror");
      },
    });
  }
}

function getAll() {
  return $.ajax({
    type: "GET",
    url: "libs/php/getAll.php",
    data: {},
    dataType: "json",
  });
}

function getAllDepartment() {
  return $.ajax({
    type: "GET",
    url: "libs/php/getAllDepartments.php",
    data: {},
    dataType: "json",
  });
}
function getAllLocation() {
  return $.ajax({
    type: "GET",
    url: "libs/php/getAllLocations.php",
    data: {},
    dataType: "json",
  });
}

var employeeTable;
var departmentTable;
var locationTable;
var currTab = "Employee";

const loadAllDetails = () => {
  getAllLocation().success(function (data) {
    locationTable = new Locations(data["data"], [
      { th: "Location", sort: "name" },
    ]);

    getAllDepartment().success(function (data) {
      departmentTable = new Departments(
        data["data"],
        [
          { th: "Department", sort: "name" },
          { th: "Location", sort: "locationID" },
        ],
        locationTable
      );
      getAll().success(function (data) {
        employeeTable = new Employee(
          data["data"],
          [
            { th: "First Name", sort: "firstName" },
            { th: "Last Name", sort: "lastName" },
            { th: "Department", sort: "department" },
          ],
          departmentTable
        );
        if (currTab == "Employee") {
          $("#nav-link-emp").click();
        } else if (currTab == "Department") {
          $("#nav-link-dept").click();
        } else if (currTab == "Location") {
          $("#nav-link-loc").click();
        }
        $("#loader").fadeOut(100);
      });
    });
  });
};

$(document).ready(function () {
  loadAllDetails();
  $("#newDeptButton").hide();
  $("#newLocButton").hide();
  $("#filter-loc").hide();
});

$("#editEmp").on("click", function (e) {
  e.preventDefault();
  employeeTable.editEmployee();
});

$("#UpdateEmployeeForm").on("submit", function (e) {
  e.preventDefault();
  employeeTable.submitEmployee();
});

$("#deleteEmp").on("click", function (e) {
  e.preventDefault();
  employeeTable.deleteEmployee();
});

$("#newEmpButton").on("click", function (e) {
  e.preventDefault();
  employeeTable.addEmployee();
  let form = $("#UpdateEmployeeForm");
  $(form).removeClass("was-validated");
});

$("#newLocButton").on("click", function (e) {
  e.preventDefault();
  locationTable.addLocation();
  let form = $("#LocationForm");
  $(form).removeClass("was-validated");
});

$("#inputDepartment-drop").on("change", function () {
  employeeTable.currDepartment =
    $(this).val() != "" ? departmentTable.getDepartmentById($(this).val()) : "";
  employeeTable.buildTable();
});

$("table").on("click", ".head", function () {
  let sort = $(this).closest("th").attr("id");
  if (currTab == "Employee") {
    employeeTable.sortTable(sort);
    employeeTable.buildTable();
  } else if (currTab == "Department") {
    departmentTable.sortTable(sort);
    departmentTable.buildTable();
  } else if (currTab == "Location") {
    locationTable.sortTable(sort);
    locationTable.buildTable();
  }
});

$("#searchText").keyup(function () {
  if (currTab == "Employee") {
    employeeTable.search = $(this).val().toLowerCase();
    employeeTable.buildTable();
  } else if (currTab == "Department") {
    departmentTable.search = $(this).val().toLowerCase();
    departmentTable.buildTable();
  } else if (currTab == "Location") {
    locationTable.search = $(this).val().toLowerCase();
    locationTable.buildTable();
  }
});

$("#inputLoc-drop").on("change", function () {
  departmentTable.currLocation = $(this).val();
  departmentTable.buildTable();
});

$("table").on("click", ".viewDepartment", function () {
  departmentTable.departmentDetails($(this).closest("tr").attr("id"));
});

$("table").on("click", ".viewEmployee", function () {
  employeeTable.employeeDetails($(this).closest("tr").attr("id"));
});

$("table").on("click", ".viewLocation", function () {
  locationTable.locationDetails($(this).closest("tr").attr("id"));
});

$("#editDept").on("click", function (e) {
  e.preventDefault();
  departmentTable.editDepartment();
});

$("#editLoc").on("click", function (e) {
  e.preventDefault();
  locationTable.editLocation();
});

$("#newDeptButton").on("click", function (e) {
  e.preventDefault();
  departmentTable.addDepartment();
  let form = $("#DepartmentForm");
  $(form).removeClass("was-validated");
});

$("#DepartmentForm").on("submit", function (e) {
  e.preventDefault();
  departmentTable.submitDepartment();
});

$("#LocationForm").on("submit", function (e) {
  e.preventDefault();
  locationTable.submitLocation();
});

$("#delDept").on("click", function (e) {
  e.preventDefault();
  departmentTable.deleteDepartment();
});

$("#delLoc").on("click", function (e) {
  e.preventDefault();
  locationTable.deleteLocation();
});

$("#nav-link-emp").on("click", function (e) {
  $("#loader").show().css("opacity", 0.5);
  e.preventDefault();
  employeeTable.sortOrder = "&#9662;";
  employeeTable.sortBy = "firstName";
  employeeTable.currDepartment = "";
  employeeTable.search = "";
  employeeTable.sortByKey(employeeTable.data, "firstName");
  employeeTable.buildTable();
  $("#newEmpButton").show();
  $("#newDeptButton").hide();
  $("#newLocButton").hide();
  $("#filter-loc").hide();
  $("#filter-dept").show();
  $(".nav-link").removeClass("active");
  $(this).addClass("active");
  currTab = "Employee";
  $("#searchText").val("");
});

$("#nav-link-dept").on("click", function (e) {
  $("#loader").show().css("opacity", 0.5);
  e.preventDefault();
  departmentTable.sortOrder = "&#9662;";
  departmentTable.sortBy = "name";
  departmentTable.currLocation = "";
  departmentTable.search = "";
  departmentTable.sortByKey(departmentTable.data, "name");
  departmentTable.buildTable();
  $("#newDeptButton").show();
  $("#newEmpButton").hide();
  $("#newLocButton").hide();
  $("#filter-loc").show();
  $("#filter-dept").hide();
  $(".nav-link").removeClass("active");
  $(this).addClass("active");
  currTab = "Department";
  $("#searchText").val("");
});

$("#nav-link-loc").on("click", function (e) {
  $("#loader").show().css("opacity", 0.5);
  e.preventDefault();
  locationTable.sortOrder = "&#9662;";
  locationTable.sortBy = "name";
  locationTable.currLocation = "";
  locationTable.search = "";
  locationTable.sortByKey(locationTable.data, "name");
  locationTable.buildTable();
  $("#newLocButton").show();
  $("#newDeptButton").hide();
  $("#newEmpButton").hide();
  $("#filter-loc").hide();
  $("#filter-dept").hide();
  $(".nav-link").removeClass("active");
  $(this).addClass("active");
  currTab = "Location";
  $("#searchText").val("");
});
