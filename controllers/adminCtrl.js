const adminModel = require("../model/adminModel");

exports.login = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  console.log("hi");
  adminModel.login(email, password, async (err, Data18, flag) => {
    if (err) {
      logger.error("Error While Getting Meeting Data ", err);
      res.send({ result: stdCodes.message.serverError.code, message: "" });
      return;
    } else {
      if (flag == 1) {
        res.send({ result: "Fail", Message: "Email Does not Exists!" });
        return;
      } else if (flag == 2) {
        res.send({ result: "Fail", Message: "Incorrect password!" });
        return;
      } else {
        res.send({ result: "success", data: Data18 });
        return;
      }
    }
  });
};
exports.admincreateUser = async (req, res) => {
  let name = req.body.name;
  let phone_no = req.body.phone_no;
  let role_id = req.body.role_id;
  let designation = req.body.designation;
  let joined_on = req.body.joined_on;
  let email = req.body.email;
  let password = req.body.password;
  let offer_letter_location = "";
  let current_timestamp = moment().format("yyyyMMDDHHmmss");
  let logged_user_id = req.body.logged_user_id;

  console.log(current_timestamp);

  if (req.files) {
    if (!fs.existsSync("./filestorage/create_user_upload")) {
      fs.mkdirSync("./filestorage/create_user_upload", { recursive: true });
    }
    if (req.files.offer_letter) {
      console.log(req.files.offer_letter[0].mimetype, "ddddddddddddddd");

      if (
        req.files.offer_letter[0].mimetype === "image/png" ||
        req.files.offer_letter[0].mimetype === "image/jpeg" ||
        req.files.offer_letter[0].mimetype === "image/jpg" ||
        req.files.offer_letter[0].mimetype === "application/pdf" ||
        req.files.offer_letter[0].mimetype ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        offer_letter_location =
          current_timestamp + "_" + req.files.offer_letter[0].originalname;
        offer_letter_location =
          "./filestorage/create_user_upload" +
          current_timestamp +
          "_" +
          req.files.offer_letter[0].originalname;
        await fs.writeFile(
          "./filestorage/create_user_upload" +
            current_timestamp +
            "_" +
            req.files.offer_letter[0].originalname,
          req.files.offer_letter[0].buffer,
          async function (err) {
            if (err) {
              logger.error("Error While Getting bank file creating ", err);
              res.send({
                code: stdCodes.message.serverError.code,
                message: stdCodes.message.serverError.message,
              });
              return;
            }
          }
        );
      } else {
        res.send({
          code: stdCodes.message.userExits.code,
          message: "Uploaded Offer Letter  Invalid Format",
        });
        return;
      }
    }
  }

  console.log("hi");
  console.log(email, "email");
  adminModel.admincreateUser(
    name,
    phone_no,
    role_id,
    designation,
    joined_on,
    email,
    password,
    offer_letter_location,
    logged_user_id,
    async (err, Data18, flag) => {
      if (err) {
        logger.error("Error While Getting Meeting Data ", err);
        res.send({ result: stdCodes.message.serverError.code, message: "" });
        return;
      } else {
        if (flag == 1) {
          res.send({
            result: "Fail",
            Message: "User Already Exists for this Role",
          });
          return;
        } else if (flag == 2) {
          res.send({ result: "Fail", Message: "Incorrect password!" });
          return;
        } else {
          res.send({
            result: "success",
            Message: "User Created Successfully",
            data: Data18,
          });
          return;
        }
      }
    }
  );
};

exports.roles = async (req, res) => {
  console.log("hi");
  adminModel.roles(async (err, Data18, flag) => {
    if (err) {
      logger.error("Error While Getting Meeting Data ", err);
      res.send({ result: stdCodes.message.serverError.code, message: "" });
      return;
    } else {
      res.send({ result: "success", data: Data18 });
      return;
    }
  });
};

exports.creating_task = async (req, res) => {
  let task_name = req.body.task_name;
  let task_desc = req.body.task_desc;
  let created_role_id = req.body.logged_role_id;
  let c_by = req.body.logged_user_id;
  // let task_name = req.body.task_name;
  console.log("hi");
  adminModel.creating_task(
    task_name,
    task_desc,
    created_role_id,
    c_by,
    async (err, Data18, flag) => {
      if (err) {
        logger.error("Error While creating_task ", err);
        res.send({ result: stdCodes.message.serverError.code, message: "" });
        return;
      } else {
        if (flag == 1) {
          res.send({
            result: "success",
            message: "Task Name and Task Description Already Exists!",
          });
          return;
        } else {
          res.send({
            result: "success",
            message: "Created Successfully.",
            Data: Data18,
          });
          return;
        }
      }
    }
  );
};

exports.view_task = async (req, res) => {
  let logged_user_id = req.body.logged_user_id;
  let year = req.body.year;
  let status = req.body.status;
  console.log("hi");
  adminModel.view_task(
    logged_user_id,
    year,
    status,
    async (err, Data18, flag) => {
      if (err) {
        logger.error("Error While Getting view_task ", err);
        res.send({ result: stdCodes.message.serverError.code, message: "" });
        return;
      } else {
        res.send({ result: "success", data: Data18 });
        return;
      }
    }
  );
};

exports.view_task_status_update = async (req, res) => {
  let logged_user_id = req.body.logged_user_id;
  let status = req.body.status;
  let task_id = req.body.task_id;
  console.log("hi");
  adminModel.view_task_status_update(
    logged_user_id,
    status,
    task_id,
    async (err, Data18, flag) => {
      if (err) {
        logger.error("Error While Getting view_task ", err);
        res.send({ result: stdCodes.message.serverError.code, message: "" });
        return;
      } else {
        if (status == "Delete") {
          res.send({ result: "success", Message: "Deleted Successfully" });
          return;
        } else {
          res.send({ result: "success", Message: "Updated Successfully" });
          return;
        }
      }
    }
  );
};

exports.names_basedon_role = async (req, res) => {
  let logged_role_id = req.body.logged_role_id;
  console.log("hi");
  adminModel.names_basedon_role(logged_role_id, async (err, Data18, flag) => {
    if (err) {
      logger.error("Error While Getting names_basedon_role ", err);
      res.send({ result: stdCodes.message.serverError.code, message: "" });
      return;
    } else {
      res.send({ result: "success", data: Data18 });
      return;
    }
  });
};

exports.advisor_names_exceptlogged = async (req, res) => {
  let logged_user_id = req.body.logged_user_id;
  console.log("hi");
  adminModel.advisor_names_exceptlogged(
    logged_user_id,
    async (err, Data18, flag) => {
      if (err) {
        logger.error("Error While Getting advisor_names_exceptlogged ", err);
        res.send({ result: stdCodes.message.serverError.code, message: "" });
        return;
      } else {
        res.send({ result: "success", data: Data18 });
        return;
      }
    }
  );
};

exports.send_message = async (req, res) => {
  let selected_role_id = req.body.selected_role_id;
  let selected_name = req.body.selected_name_id;
  let message = req.body.message;
  let logged_user_id = req.body.logged_user_id;
  console.log("hi");
  adminModel.send_message(
    selected_role_id,
    selected_name,
    message,
    logged_user_id,
    async (err, Data18, flag) => {
      if (err) {
        logger.error("Error While Getting names_basedon_role ", err);
        res.send({ result: stdCodes.message.serverError.code, message: "" });
        return;
      } else {
        res.send({ result: "success", data: Data18 });
        return;
      }
    }
  );
};
exports.notification_display = async (req, res) => {
  let selected_role_id = req.body.selected_role_id;
  let logged_user_id = req.body.logged_user_id;
  console.log("hi");
  adminModel.notification_display(
    selected_role_id,
    logged_user_id,
    async (err, Data18, flag) => {
      if (err) {
        logger.error("Error While Getting notification_display ", err);
        res.send({ result: stdCodes.message.serverError.code, message: "" });
        return;
      } else {
        res.send({ result: "success", data: Data18 });
        return;
      }
    }
  );
};
exports.manage_roles_get = async (req, res) => {
  console.log("hi");
  adminModel.manage_roles_get(async (err, Data18, flag) => {
    if (err) {
      logger.error("Error While Getting names_basedon_role ", err);
      res.send({ result: stdCodes.message.serverError.code, message: "" });
      return;
    } else {
      res.send({ result: "success", data: Data18 });
      return;
    }
  });
};

exports.manage_roles_delete = async (req, res) => {
  let deleted_user_id = req.body.deleted_user_id;
  console.log("hi");
  adminModel.manage_roles_delete(deleted_user_id, async (err, Data18, flag) => {
    if (err) {
      logger.error("Error While Getting manage_roles_delete ", err);
      res.send({ result: stdCodes.message.serverError.code, message: "" });
      return;
    } else {
      res.send({ result: "success", Message: "User Deleted Successfully." });
      return;
    }
  });
};

exports.advisor_todo_row_save = async (req, res) => {
  let student_interest = req.body.student_interest;
  let to_do_id = req.body.to_do_id;
  let assign_checkbox = req.body.assign_checkbox;
  let comments = req.body.comments;
  console.log("hi");
  adminModel.advisor_todo_row_save(
    student_interest,
    to_do_id,
    assign_checkbox,
    comments,
    async (err, Data18, flag) => {
      if (err) {
        logger.error("Error While Getting manage_roles_delete ", err);
        res.send({ result: stdCodes.message.serverError.code, message: "" });
        return;
      } else {
        res.send({ result: "success", Message: "Submitted Successfully" });
        return;
      }
    }
  );
};

exports.advisor_create_student = async (req, res) => {
  let username = req.body.username;
  let phoneNumber = req.body.phoneNumber;
  let email = req.body.email;
  let password = req.body.password;
  let created_user_id = req.body.logged_user_id;
  console.log("hi");
  adminModel.advisor_create_student(
    username,
    phoneNumber,
    email,
    password,
    created_user_id,
    async (err, Data18, flag) => {
      if (err) {
        logger.error("Error While Getting manage_roles_delete ", err);
        res.send({ result: stdCodes.message.serverError.code, message: "" });
        return;
      } else {
        res.send({ result: "success", Message: "Created Successfully" });
        return;
      }
    }
  );
};

exports.advisor_assign_stud_dropdown = async (req, res) => {
  console.log("hi");
  adminModel.advisor_assign_stud_dropdown(async (err, Data18, flag) => {
    if (err) {
      logger.error("Error While Getting manage_roles_delete ", err);
      res.send({ result: stdCodes.message.serverError.code, message: "" });
      return;
    } else {
      res.send({ result: "success", Data: Data18 });
      return;
    }
  });
};

exports.advisor_assign_advisorname_dropdown = async (req, res) => {
  let logged_user_id = req.body.logged_user_id;
  console.log("hi");
  adminModel.advisor_assign_advisorname_dropdown(
    logged_user_id,
    async (err, Data18, flag) => {
      if (err) {
        logger.error("Error While Getting manage_roles_delete ", err);
        res.send({ result: stdCodes.message.serverError.code, message: "" });
        return;
      } else {
        res.send({ result: "success", Data: Data18 });
        return;
      }
    }
  );
};

exports.advisor_assign_form_submit = async (req, res) => {
  let logged_user_id = req.body.logged_user_id;
  let selected_student_id = req.body.selected_student_id;
  let selected_advisor_id = req.body.assigned_person_id;
  let conflicts_faced = req.body.conflicts_faced;
  console.log("hi");
  adminModel.advisor_assign_form_submit(
    logged_user_id,
    selected_student_id,
    selected_advisor_id,
    conflicts_faced,
    async (err, Data18, flag) => {
      if (err) {
        logger.error("Error While Getting manage_roles_delete ", err);
        res.send({ result: stdCodes.message.serverError.code, message: "" });
        return;
      } else {
        res.send({ result: "success", Message: "Assigned Successfully" });
        return;
      }
    }
  );
};

exports.admin_csv_upload = async (req, res) => {
  let current_timestamp = moment().format("YYYYMMDDHHmmss");
  // console.log(req.files,"files log::::::::")
  let multiple_record_file =
    current_timestamp + "_" + req.files.file_upload[0].originalname;
  if (req.files) {
    if (!fs.existsSync("./filestorage/adminCSV")) {
      fs.mkdirSync("./filestorage/adminCSV", { recursive: true });
    }
    await fs.writeFile(
      "./filestorage/adminCSV/" +
        current_timestamp +
        "_" +
        req.files.file_upload[0].originalname,
      req.files.file_upload[0].buffer,
      async function (err) {
        if (err) {
          logger.error(
            "Error While Getting AssetDetails_Multiple_record %s",
            err
          );
          res.send({
            code: stdCodes.message.serverError.code,
            message: stdCodes.message.serverError.message,
          });
          return;
        } else {
          console.log("hi", multiple_record_file);
          adminModel.admin_csv_upload(
            multiple_record_file,
            async (err, Data18, flag) => {
              if (err) {
                logger.error("Error While Getting notification_display ", err);
                res.send({
                  result: stdCodes.message.serverError.code,
                  message: "",
                });
                return;
              } else {
                res.send({
                  result: "success",
                  message: "File Uploaded Successfully",
                });
                return;
              }
            }
          );
        }
      }
    );
  }
};

exports.reverted_stud_list_csv = async (req, res) => {
  console.log("hi");
  let logged_user_id = req.body.logged_user_id;
  let role_id = req.body.role_id;
  adminModel.reverted_stud_list_csv(
    logged_user_id,
    role_id,
    async (err, Data18, flag) => {
      if (err) {
        logger.error("Error While Getting reverted_stud_list_csv ", err);
        res.send({ result: stdCodes.message.serverError.code, message: "" });
        return;
      } else {
        res.send({ result: "success", data: Data18 });
        return;
      }
    }
  );
};

exports.reverted_stud_save_button = async (req, res) => {
  console.log("hi");
  let logged_user_id = req.body.logged_user_id;
  let selected_user_id = req.body.selected_user_id;
  let selected_checkbox_id = req.body.selected_checkbox_id;
  adminModel.reverted_stud_save_button(
    logged_user_id,
    selected_user_id,
    selected_checkbox_id,
    async (err, Data18, flag) => {
      if (err) {
        logger.error("Error While Getting reverted_stud_save_button ", err);
        res.send({ result: stdCodes.message.serverError.code, message: "" });
        return;
      } else {
        res.send({ result: "success", message: "Assigned Successfully" });
        return;
      }
    }
  );
};

exports.admin_reverted_list_get = async (req, res) => {
  console.log("hi");
  adminModel.admin_reverted_list_get(async (err, Data18, flag) => {
    if (err) {
      logger.error("Error While Getting admin_reverted_list_get ", err);
      res.send({ result: stdCodes.message.serverError.code, message: "" });
      return;
    } else {
      res.send({ result: "success", Data: Data18 });
      return;
    }
  });
};

exports.admin_reverted_list_delete = async (req, res) => {
  console.log("hi");
  let id = req.body.id;
  adminModel.admin_reverted_list_delete(id, async (err, Data18, flag) => {
    if (err) {
      logger.error("Error While Getting admin_reverted_list_delete ", err);
      res.send({ result: stdCodes.message.serverError.code, message: "" });
      return;
    } else {
      res.send({ result: "success", Data: Data18 });
      return;
    }
  });
};

exports.login_new = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  console.log("hi");
  adminModel.login_new(email, password, async (err, Data18, flag) => {
    if (err) {
      logger.error("Error While Getting Meeting Data ", err);
      res.send({ result: stdCodes.message.serverError.code, message: "" });
      return;
    } else {
      if (flag == 1) {
        res.send({ result: "Fail", Message: "Email Does not Exists!" });
        return;
      } else if (flag == 2) {
        res.send({ result: "Fail", Message: "Incorrect password!" });
        return;
      } else {
        res.send({ result: "success", data: Data18 });
        return;
      }
    }
  });
};

exports.trackProcess = async (req, res) => {
  console.log("hi");
  let advisor_id = req.body.advisor_id;
  adminModel.trackProcess(advisor_id, async (err, Data18, flag) => {
    if (err) {
      logger.error("Error While Getting admin_reverted_list_delete ", err);
      res.send({ result: stdCodes.message.serverError.code, message: "" });
      return;
    } else {
      if (flag == 1) {
        res.send({ result: "success", Message: "No Records Found ." });
        return;
      } else {
        res.send({ result: "success", Data: Data18 });
        return;
      }
    }
  });
};

exports.count_check_advisor_form = async (req, res) => {
  console.log("hi");
  let advisor_id = req.body.advisor_id;
  let entered_count = req.body.entered_count;
  adminModel.count_check_advisor_form(
    advisor_id,
    entered_count,
    async (err, Data18, flag) => {
      if (err) {
        logger.error("Error While Getting admin_reverted_list_delete ", err);
        res.send({ result: stdCodes.message.serverError.code, message: "" });
        return;
      } else {
        if (flag == 1) {
          res.send({ result: "success", Message: "No Records Found ." });
          return;
        }
        if (flag == 2) {
          res.send({
            result: "success",
            Message: `advisor has only ${Data18} student.`,
          });
          return;
        } else {
          res.send({ result: "success", Data: Data18 });
          return;
        }
      }
    }
  );
};

exports.advisor_form_studNames_dropdown = async (req, res) => {
  console.log("hi");
  let advisor_id = req.body.advisor_id;
  let selected_student_id = req.body.selected_student_id;
  console.log(selected_student_id, "***");
  adminModel.advisor_form_studNames_dropdown(
    advisor_id,
    selected_student_id,
    async (err, Data18, flag) => {
      if (err) {
        logger.error("Error While Getting admin_reverted_list_delete ", err);
        res.send({ result: stdCodes.message.serverError.code, message: "" });
        return;
      } else {
        if (flag == 1) {
          res.send({ result: "success", Message: "No Records Found ." });
          return;
        }
        if (flag == 2) {
          res.send({
            result: "success",
            Message: `advisor has only ${Data18} student.`,
          });
          return;
        } else {
          res.send({ result: "success", Data: Data18 });
          return;
        }
      }
    }
  );
};

exports.advisor_formAssign_submit_button = async (req, res) => {
  console.log("hi");
  let data = req.body.data;
  let logged_user_id = req.body.logged_user_id;
  adminModel.advisor_formAssign_submit_button(
    data,
    logged_user_id,
    async (err, Data18, flag) => {
      if (err) {
        logger.error("Error While Getting admin_reverted_list_delete ", err);
        res.send({ result: stdCodes.message.serverError.code, message: "" });
        return;
      } else {
        // if (flag == 1) {
        //     res.send({ "result": "success", "Message": "No Records Found ." });
        //     return;
        // }
        // if (flag == 2) {
        //     res.send({ "result": "success", "Message": `Incubator has only ${Data18} student.` });
        //     return;
        // }
        // else {
        res.send({ result: "success", Message: "Submitted Successfully" });
        return;
      }
      // }
    }
  );
};

exports.edit_profile = async (req, res) => {
  console.log("hi");
  let logged_user_id = req.body.logged_user_id;
  let user_name = req.body.user_name;
  let phone_number = req.body.phone_number;

  adminModel.edit_profile(
    logged_user_id,
    user_name,
    phone_number,
    async (err, Data18, flag) => {
      if (err) {
        logger.error("Error While Getting edit_profile ", err);
        res.send({ result: stdCodes.message.serverError.code, message: "" });
        return;
      } else {
        res.send({ result: "success", Data: Data18 });
        return;
      }
    }
  );
};

exports.change_password = async (req, res) => {
  console.log("hi");
  let new_password = req.body.new_password;
  let logged_user_id = req.body.logged_user_id;

  adminModel.change_password(
    new_password,
    logged_user_id,
    async (err, Data18, flag) => {
      if (err) {
        logger.error("Error While Getting edit_profile ", err);
        res.send({ result: stdCodes.message.serverError.code, message: "" });
        return;
      } else {
        res.send({ result: "success", Data: Data18 });
        return;
      }
    }
  );
};

exports.advisor_approve_reject_documents = async (req, res) => {
  console.log("hi");
  let c_by = req.body.c_by;
  let status = req.body.status;
  adminModel.advisor_approve_reject_documents(
    c_by,
    status,
    async (err, Data18, flag) => {
      if (err) {
        logger.error("Error While Getting edit_profile ", err);
        res.send({ result: stdCodes.message.serverError.code, message: "" });
        return;
      } else {
        if (status == "Approved") {
          res.send({
            result: "success",
            Data: "Updated Successfully",
            Indicator: 1,
          });
          return;
        } else {
          res.send({
            result: "success",
            Data: "Updated Successfully",
            Indicator: 0,
          });
          return;
        }
      }
    }
  );
};

exports.advisor_assignto_consultant = async (req, res) => {
  console.log("hi");
  let consultant_id = req.body.consultant_id;
  let logged_user_id = req.body.logged_user_id;
  let prima = req.body.prima;
  adminModel.advisor_assignto_consultant(
    consultant_id,
    logged_user_id,
    prima,
    async (err, Data18, flag) => {
      if (err) {
        logger.error("Error While Getting edit_profile ", err);
        res.send({ result: stdCodes.message.serverError.code, message: "" });
        return;
      } else {
        res.send({ result: "success", Data: "Assigned Successfully" });
        return;
      }
    }
  );
};

exports.consultant_get_details = async (req, res) => {
  console.log("hi");

  let logged_user_id = req.body.logged_user_id;

  adminModel.consultant_get_details(
    logged_user_id,
    async (err, Data18, flag) => {
      if (err) {
        logger.error("Error While Getting edit_profile ", err);
        res.send({ result: stdCodes.message.serverError.code, message: "" });
        return;
      } else {
        res.send({ result: "success", Data: Data18 });
        return;
      }
    }
  );
};

exports.convet_to_track_progress = async (req, res) => {
  let student_id = req.body.student_id;
  let adviser_id = req.body.adviser_id;
  adminModel.addToTrackProgress(student_id, adviser_id, async (err, result) => {
    if (err) {
      res.send({ error: err });
    } else {
      console.log("success");
    }
  });
};

exports.student_upload_submit = async (req, res) => {
  let current_timestamp = moment().format("YYYYMMDDHHmmss");
  let logged_user_id = req.body.logged_user_id;
  let indicator = req.body.indicator;
  // console.log(req.files,"files log::::::::")
  let multiple_record_file =
    indicator +
    "_" +
    current_timestamp +
    "_" +
    req.files.fileupload[0].originalname;
  console.log(multiple_record_file, "hi");
  // return
  if (req.files) {
    if (!fs.existsSync("./filestorage/student_uploads")) {
      fs.mkdirSync("./filestorage/student_uploads", { recursive: true });
    }
    await fs.writeFile(
      "./filestorage/student_uploads/" +
        current_timestamp +
        "_" +
        req.files.fileupload[0].originalname,
      req.files.fileupload[0].buffer,
      async function (err) {
        if (err) {
          logger.error(
            "Error While Getting AssetDetails_Multiple_record %s",
            err
          );
          res.send({
            code: stdCodes.message.serverError.code,
            message: stdCodes.message.serverError.message,
          });
          return;
        } else {
          console.log("hi", multiple_record_file);

          adminModel.student_upload_submit(
            multiple_record_file,
            logged_user_id,
            indicator,
            async (err, Data18, flag) => {
              if (err) {
                logger.error("Error While Getting notification_display ", err);
                res.send({
                  result: stdCodes.message.serverError.code,
                  message: "",
                });
                return;
              } else {
                res.send({
                  result: "success",
                  message: "File Uploaded Successfully",
                });
                return;
              }
            }
          );
        }
      }
    );
  }
};

exports.student_upload_get = async (req, res) => {
  console.log("hi");
  // let new_password = req.body.new_password;
  let logged_user_id = req.body.logged_user_id;

  adminModel.student_upload_get(logged_user_id, async (err, Data18, flag) => {
    if (err) {
      logger.error("Error While Getting edit_profile ", err);
      res.send({ result: stdCodes.message.serverError.code, message: "" });
      return;
    } else {
      res.send({ result: "success", Data: Data18 });
      return;
    }
  });
};

exports.student_profile_edit = async (req, res) => {
  console.log("hi");
  let name = req.body.name;
  let mobile_number = req.body.mobile_number;
  let interest_state = req.body.interest_state;
  let degree_passed_year = req.body.degree_passed_year;
  let courses = req.body.courses;
  let marks = req.body.marks;
  let logged_user_id = req.body.logged_user_id;

  adminModel.student_profile_edit(
    name,
    mobile_number,
    interest_state,
    degree_passed_year,
    courses,
    marks,
    logged_user_id,
    async (err, Data18, flag) => {
      if (err) {
        logger.error("Error While Getting edit_profile ", err);
        res.send({ result: stdCodes.message.serverError.code, message: "" });
        return;
      } else {
        res.send({ result: "success", Message: "Updated Successfully" });
        return;
      }
    }
  );
};

exports.consultant_track_progress_button = async (req, res) => {
  console.log("hi");
  // let new_password = req.body.new_password;
  let primary_id = req.body.primary_id;

  adminModel.consultant_track_progress_button(
    primary_id,
    async (err, Data18, flag) => {
      if (err) {
        logger.error("Error While Getting edit_profile ", err);
        res.send({ result: stdCodes.message.serverError.code, message: "" });
        return;
      } else {
        res.send({ result: "success", Data: Data18 });
        return;
      }
    }
  );
};

exports.track_progress_get = async (req, res) => {
  console.log("hi");
  // let new_password = req.body.new_password;
  // let primary_id = req.body.primary_id;

  adminModel.track_progress_get(async (err, Data18, flag) => {
    if (err) {
      logger.error("Error While Getting edit_profile ", err);
      res.send({ result: stdCodes.message.serverError.code, message: "" });
      return;
    } else {
      res.send({ result: "success", Data: Data18 });
      return;
    }
  });
};

exports.track_progress_save_button = async (req, res) => {
  console.log("hi");
  let choosen_university = req.body.choosen_university;
  let primary_id = req.body.primary_id;
  let choosen_comments = req.body.choosen_comments;

  adminModel.track_progress_save_button(
    primary_id,
    choosen_university,
    choosen_comments,
    async (err, Data18, flag) => {
      if (err) {
        logger.error("Error While Getting edit_profile ", err);
        res.send({ result: stdCodes.message.serverError.code, message: "" });
        return;
      } else {
        res.send({ result: "success", Data: Data18 });
        return;
      }
    }
  );
};

exports.admin_trackprocess_get = async (req, res) => {
  console.log("hi");
  // let new_password = req.body.new_password;
  // let primary_id = req.body.primary_id;

  adminModel.admin_trackprocess_get(async (err, Data18, flag) => {
    if (err) {
      logger.error("Error While Getting edit_profile ", err);
      res.send({ result: stdCodes.message.serverError.code, message: "" });
      return;
    } else {
      res.send({ result: "success", Data: Data18 });
      return;
    }
  });
};
