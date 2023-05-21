const { message } = require("../config/error_codes");

exports.login = (email, password, callback) => {
  let cntxtDtls = "Get login api";
  QRY_TO_EXEC = `SELECT * FROM users_dtl_t where email=?`;
  dbutil.execQuery(
    sqldb.MySQLConPool,
    QRY_TO_EXEC,
    cntxtDtls,
    [email],
    function (err, results) {
      if (err) {
        callback(err, 0);
        return;
      } else {
        if (results.length == 0) {
          callback(0, null, 1);
          return;
        } else {
          QRY_TO_EXEC = `SELECT * FROM users_dtl_t where email=? and pwd=? `;
          dbutil.execQuery(
            sqldb.MySQLConPool,
            QRY_TO_EXEC,
            cntxtDtls,
            [email, password],
            function (err, results1) {
              if (results1 == 0) {
                callback(err, null, 2);
                return;
              } else {
                let course = results1[0].courses;
                console.log(course, "cccccc");
                exec = `select * from users_dtl_t where id=${results1[0].c_by}`;
                dbutil.execQuery(
                  sqldb.MySQLConPool,
                  exec,
                  cntxtDtls,
                  [],
                  function (err, results1811) {
                    results1[0]["creator"] = results1811[0].user_name;
                    console.log(results1);
                    callback(err, results1);
                    return;
                  }
                );
              }
            }
          );
        }
      }
    }
  );
};

exports.admincreateUser = (
  name,
  phone_no,
  role_id,
  designation,
  joined_on,
  email,
  password,
  offer_letter_location,
  logged_user_id,
  callback
) => {
  let cntxtDtls = "Get admincreateUser api";
  QRY_TO_EXEC = `SELECT * FROM users_dtl_t where email=? and role=? and phone_no=?;`;
  dbutil.execQuery(
    sqldb.MySQLConPool,
    QRY_TO_EXEC,
    cntxtDtls,
    [email, role_id, phone_no],
    function (err, results) {
      if (err) {
        callback(err, 0);
        return;
      } else {
        if (results.length > 0) {
          callback(0, null, 1);
          return;
        } else {
          console.log(email);

          QRY_TO_EXEC = `insert into users_dtl_t (email, pwd, role, user_name,designation, phone_no, joined_on,offerletter_upload,c_by) 
                values("${email}","${password}","${role_id}","${name}","${designation}","${phone_no}","${joined_on}","${offer_letter_location}",${logged_user_id});`;
          dbutil.execQuery(
            sqldb.MySQLConPool,
            QRY_TO_EXEC,
            cntxtDtls,
            [],
            function (err, results1) {
              console.log(results1.insertId, "^^^^");
              QRY_TO_EXEC = `select * from users_dtl_t where id=?;`;
              dbutil.execQuery(
                sqldb.MySQLConPool,
                QRY_TO_EXEC,
                cntxtDtls,
                [results1.insertId],
                function (err, results18) {
                  exec = `select * from users_dtl_t where id=${results18[0].c_by}`;
                  dbutil.execQuery(
                    sqldb.MySQLConPool,
                    exec,
                    cntxtDtls,
                    [],
                    function (err, results1811) {
                      results18[0]["creator"] = results1811[0].user_name;
                      console.log(results18);
                      callback(err, results18);
                      return;
                    }
                  );
                }
              );
            }
          );
        }
      }
    }
  );
};
exports.roles = (callback) => {
  let cntxtDtls = "Get roles api";
  QRY_TO_EXEC = `SELECT * FROM roles_table where status=1;`;
  dbutil.execQuery(
    sqldb.MySQLConPool,
    QRY_TO_EXEC,
    cntxtDtls,
    [],
    function (err, results) {
      if (err) {
        callback(err, 0);
        return;
      } else {
        callback(err, results);
        return;
      }
    }
  );
};

exports.creating_task = (
  task_name,
  task_desc,
  created_role_id,
  c_by,
  callback
) => {
  let cntxtDtls = "Get creating_task api";
  QRY_TO_EXEC = `select * from tasks_dlt_t where task_name=? and task_desc=?`;

  dbutil.execQuery(
    sqldb.MySQLConPool,
    QRY_TO_EXEC,
    cntxtDtls,
    [task_name, task_desc],
    function (err, results11) {
      if (results11.length > 0) {
        callback(err, null, 1);
        return;
      } else {
        QRY_TO_EXEC = `insert into tasks_dlt_t(task_name, task_desc, created_role_id, c_by) values(?)`;
        let values = [task_name, task_desc, created_role_id, c_by];
        dbutil.execQuery(
          sqldb.MySQLConPool,
          QRY_TO_EXEC,
          cntxtDtls,
          [values],
          function (err, results) {
            if (err) {
              callback(err, 0);
              return;
            } else {
              QRY_TO_EXEC1 = `select * from tasks_dlt_t where id=?`;
              dbutil.execQuery(
                sqldb.MySQLConPool,
                QRY_TO_EXEC1,
                cntxtDtls,
                [results.insertId],
                function (err, results1) {
                  callback(err, results1);
                  return;
                }
              );
            }
          }
        );
      }
    }
  );
};

exports.view_task = (logged_user_id, year, status, callback) => {
  let cntxtDtls = "Get view_task api";

  if (year != 0) {
    QRY_TO_EXEC = `SELECT * FROM tasks_dlt_t where c_by=${logged_user_id}  and   is_active=1 and year(c_ts)='${year}' and status='${status}' order by id desc;`;
  } else {
    QRY_TO_EXEC = `SELECT * FROM tasks_dlt_t where c_by=${logged_user_id} and status="In Progress" and is_active=1 order by id desc;`;
  }

  dbutil.execQuery(
    sqldb.MySQLConPool,
    QRY_TO_EXEC,
    cntxtDtls,
    [],
    function (err, results) {
      if (err) {
        callback(err, 0);
        return;
      } else {
        callback(err, results);
        return;
      }
    }
  );
};

exports.view_task_status_update = (
  logged_user_id,
  status,
  task_id,
  callback
) => {
  let cntxtDtls = "Get view_task_status_update api";
  if (status == "Delete") {
    QRY_TO_EXEC = `update tasks_dlt_t set status=? ,u_by =? , is_active=0 where id=?;`;
  } else {
    QRY_TO_EXEC = `update tasks_dlt_t set status=? ,u_by =? where id=?;`;
  }

  dbutil.execQuery(
    sqldb.MySQLConPool,
    QRY_TO_EXEC,
    cntxtDtls,
    [status, logged_user_id, task_id],
    function (err, results) {
      if (err) {
        callback(err, 0);
        return;
      } else {
        callback(err, results);
        return;
      }
    }
  );
};

exports.names_basedon_role = (logged_role_id, callback) => {
  let cntxtDtls = "Get view_task api";
  QRY_TO_EXEC = `SELECT id,user_name,email FROM users_dtl_t where role=? and is_active=1;`;
  dbutil.execQuery(
    sqldb.MySQLConPool,
    QRY_TO_EXEC,
    cntxtDtls,
    [logged_role_id],
    function (err, results) {
      if (err) {
        callback(err, 0);
        return;
      } else {
        callback(err, results);
        return;
      }
    }
  );
};

exports.advisor_names_exceptlogged = (logged_user_id, callback) => {
  let cntxtDtls = "Get advisor_names_exceptlogged api";
  QRY_TO_EXEC = `SELECT id,user_name,email FROM users_dtl_t where role=2 and id !=? and is_active=1;`;
  dbutil.execQuery(
    sqldb.MySQLConPool,
    QRY_TO_EXEC,
    cntxtDtls,
    [logged_user_id],
    function (err, results) {
      if (err) {
        callback(err, 0);
        return;
      } else {
        callback(err, results);
        return;
      }
    }
  );
};

exports.send_message = (
  selected_role_id,
  selected_name,
  message,
  logged_user_id,
  callback
) => {
  let cntxtDtls = "Get send_message api";
  QRY_TO_EXEC = `insert into send_message_dtl_t (role_id, name, message, created_by) values(?)`;
  let val = [selected_role_id, selected_name, message, logged_user_id];
  dbutil.execQuery(
    sqldb.MySQLConPool,
    QRY_TO_EXEC,
    cntxtDtls,
    [val],
    function (err, results) {
      if (err) {
        callback(err, 0);
        return;
      } else {
        QRY_TO_EXEC = `select * from send_message_dtl_t where id=? `;
        dbutil.execQuery(
          sqldb.MySQLConPool,
          QRY_TO_EXEC,
          cntxtDtls,
          [results.insertId],
          function (err, results1) {
            callback(err, results1);
            return;
          }
        );
      }
    }
  );
};
exports.notification_display = (selected_role_id, logged_user_id, callback) => {
  let cntxtDtls = "Get notification_display api";
  QRY_TO_EXEC = `select s.message,u.user_name as createdby,s.c_ts as createdtime,s.created_by as reciever_id,u.role as roleid from send_message_dtl_t as s 
join users_dtl_t as u on u.id=s.created_by
 where role_id=?  and name=? order by s.id desc;`;
  // let val = [selected_role_id, selected_name, message, logged_user_id]
  dbutil.execQuery(
    sqldb.MySQLConPool,
    QRY_TO_EXEC,
    cntxtDtls,
    [selected_role_id, logged_user_id],
    function (err, results) {
      if (err) {
        callback(err, 0);
        return;
      } else {
        console.log(results, ",,,,,,,,");
        callback(err, results);
        return;
      }
    }
  );
};
exports.manage_roles_get = (callback) => {
  let cntxtDtls = "Get manage_roles_get api";
  QRY_TO_EXEC = `SELECT u.id,user_name,role,r.role_name,email,pwd,designation,c_ts as joined_date,phone_no,u.is_active
FROM users_dtl_t as u
join roles_table as r on r.id=u.role where role!=1 and u.is_active=1;`;
  dbutil.execQuery(
    sqldb.MySQLConPool,
    QRY_TO_EXEC,
    cntxtDtls,
    [],
    function (err, results) {
      if (err) {
        callback(err, 0);
        return;
      } else {
        callback(err, results);
        return;
      }
    }
  );
};

exports.manage_roles_delete = (deleted_user_id, callback) => {
  let cntxtDtls = "Get manage_roles_delete api";
  let current_timestamp = moment().format("YYYY-MM-DD");
  QRY_TO_EXEC = `update users_dtl_t set is_active=0 , u_ts= ? , u_by=1 where id=?;`;
  dbutil.execQuery(
    sqldb.MySQLConPool,
    QRY_TO_EXEC,
    cntxtDtls,
    [current_timestamp, deleted_user_id],
    function (err, results) {
      if (err) {
        callback(err, 0);
        return;
      } else {
        callback(err, results);
        return;
      }
    }
  );
};
exports.advisor_todo_row_save = (
  student_interest,
  to_do_id,
  assign_checkbox,
  comments,
  callback
) => {
  let cntxtDtls = "Get advisor_todo_row_save api";
  let current_timestamp = moment().format("YYYY-MM-DD");
  if (student_interest == "Yes") {
    console.log("YES");
    QRY_TO_EXEC = `update reverted_stud_csv_admin_t set row_time_save=?,u_ts=?,student_interest=?,assign_indicator=?,comments=? where id in (?)`;
    dbutil.execQuery(
      sqldb.MySQLConPool,
      QRY_TO_EXEC,
      cntxtDtls,
      [
        current_timestamp,
        current_timestamp,
        "Yes",
        assign_checkbox,
        comments,
        to_do_id,
      ],
      function (err, results) {
        if (err) {
          callback(err, 0);
          return;
        } else {
          callback(err, results);
          return;
        }
      }
    );
  } else if (student_interest == "Future Followup") {
    console.log("future followup");
    QRY_TO_EXEC = `update reverted_stud_csv_admin_t set checkbox_save=?,u_ts=?,student_interest=?,is_active=?,assigned_to=?,assigned_by=?,comments=? where id in (?)`;
    dbutil.execQuery(
      sqldb.MySQLConPool,
      QRY_TO_EXEC,
      cntxtDtls,
      [
        current_timestamp,
        current_timestamp,
        student_interest,
        1,
        null,
        null,
        comments,
        to_do_id,
      ],
      function (err, results) {
        if (err) {
          callback(err, 0);
          return;
        } else {
          callback(err, results);
          return;
        }
      }
    );
  } else {
    console.log("no , no resposne");
    QRY_TO_EXEC = `update reverted_stud_csv_admin_t set checkbox_save=?,u_ts=?,student_interest=?,is_active=0,assigned_to=?,assigned_by=?,comments=? where id in (?)`;
    dbutil.execQuery(
      sqldb.MySQLConPool,
      QRY_TO_EXEC,
      cntxtDtls,
      [
        current_timestamp,
        current_timestamp,
        student_interest,
        null,
        null,
        comments,
        to_do_id,
      ],
      function (err, results) {
        if (err) {
          callback(err, 0);
          return;
        } else {
          callback(err, results);
          return;
        }
      }
    );
  }
};

exports.advisor_assign_stud_dropdown = (callback) => {
  let cntxtDtls = "Get advisor_todo_row_save api";
  let current_timestamp = moment().format("YYYY-MM-DD");

  QRY_TO_EXEC = `SELECT id as student_id,Studen_Name,email_id,country_interested FROM reverted_stud_csv_admin_t where student_interest='Yes' and assign_indicator=1;`;
  dbutil.execQuery(
    sqldb.MySQLConPool,
    QRY_TO_EXEC,
    cntxtDtls,
    [],
    function (err, results) {
      if (err) {
        callback(err, 0);
        return;
      } else {
        callback(err, results);
        return;
      }
    }
  );
};

exports.advisor_assign_advisorname_dropdown = (logged_user_id, callback) => {
  let cntxtDtls = "Get advisor_assign_advisorname_dropdown api";
  let current_timestamp = moment().format("YYYY-MM-DD");
  QRY_TO_EXEC = `SELECT id,email,user_name FROM charispathway.users_dtl_t where role=2 and id !=?; `;
  dbutil.execQuery(
    sqldb.MySQLConPool,
    QRY_TO_EXEC,
    cntxtDtls,
    [logged_user_id],
    function (err, results) {
      if (err) {
        callback(err, 0);
        return;
      } else {
        callback(err, results);
        return;
      }
    }
  );
};
exports.advisor_assign_form_submit = (
  logged_user_id,
  selected_student_id,
  selected_advisor_id,
  conflicts_faced,
  callback
) => {
  let cntxtDtls = "Get advisor_assign_advisorname_dropdown api";
  let current_timestamp = moment().format("YYYY-MM-DD");
  QRY_TO_EXEC = `update reverted_stud_csv_admin_t set u_by=?, assigned_to = ?, assigned_by=?,student_interest=null,assign_indicator=0,u_ts=? where id in (?);`;
  dbutil.execQuery(
    sqldb.MySQLConPool,
    QRY_TO_EXEC,
    cntxtDtls,
    [
      logged_user_id,
      selected_advisor_id,
      logged_user_id,
      current_timestamp,
      selected_student_id,
    ],
    function (err, results) {
      if (err) {
        callback(err, 0);
        return;
      } else {
        callback(err, results);
        return;
      }
    }
  );
};

exports.admin_csv_upload = (multiple_record_file, callback) => {
  let cntxtDtls = "Get admin_csv_upload api";
  query_infile = `SET GLOBAL local_infile=1;`;
  dbutil.execQuery(
    sqldb.MySQLConPool,
    query_infile,
    cntxtDtls,
    [],
    function (err, results18) {
      QRY_TO_EXEC = `LOAD DATA LOCAL INFILE "filestorage/adminCSV/${multiple_record_file}" INTO TABLE reverted_stud_csv_admin_t 
    FIELDS TERMINATED BY ',' 
    LINES TERMINATED BY '\n' 
    IGNORE 1 LINES
    (Studen_Name, phone_no, email_id, country_interested);`;
      dbutil.execQuery(
        sqldb.MySQLConPool,
        QRY_TO_EXEC,
        cntxtDtls,
        [],
        function (err, results) {
          if (err) {
            callback(err, 0);
            return;
          } else {
            callback(err, results);
            return;
          }
        }
      );
    }
  );
};

exports.reverted_stud_list_csv = (logged_user_id, role_id, callback) => {
  let cntxtDtls = "Get reverted_stud_list_csv api";
  let QRY_TO_EXEC = "";
  if (role_id == 1) {
    QRY_TO_EXEC = `select * from reverted_stud_csv_admin_t where is_active=1 and assigned_to is null`;
  } else {
    QRY_TO_EXEC = ` select case when assign_indicator=0 then "true" when assign_indicator=1 then '' else '' end as checked,a.*
        from reverted_stud_csv_admin_t as a 
        where   is_active=1 and assigned_to=${logged_user_id} and (student_interest is null or (student_interest='Yes' and assign_indicator=0));`;
  }

  dbutil.execQuery(
    sqldb.MySQLConPool,
    QRY_TO_EXEC,
    cntxtDtls,
    [],
    function (err, results) {
      if (err) {
        callback(err, 0);
        return;
      } else {
        callback(err, results);
        return;
      }
    }
  );
};

exports.reverted_stud_save_button = (
  logged_user_id,
  selected_user_id,
  selected_checkbox_id,
  callback
) => {
  let cntxtDtls = "Get reverted_stud_save_button api";
  QRY_TO_EXEC = `update reverted_stud_csv_admin_t set is_active=1, assigned_to=${selected_user_id},assigned_by=${logged_user_id}
    where id in (${selected_checkbox_id});`;
  dbutil.execQuery(
    sqldb.MySQLConPool,
    QRY_TO_EXEC,
    cntxtDtls,
    [],
    function (err, results) {
      if (err) {
        callback(err, 0);
        return;
      } else {
        callback(err, results);
        return;
      }
    }
  );
};

exports.admin_reverted_list_get = (callback) => {
  let cntxtDtls = "Get admin_reverted_list_get api";
  QRY_TO_EXEC = `SELECT * FROM reverted_stud_csv_admin_t 
    where  student_interest='Future Followup' and is_active=1 order by checkbox_save desc;`;
  dbutil.execQuery(
    sqldb.MySQLConPool,
    QRY_TO_EXEC,
    cntxtDtls,
    [],
    function (err, results) {
      if (err) {
        callback(err, 0);
        return;
      } else {
        callback(err, results);
        return;
      }
    }
  );
};

exports.admin_reverted_list_delete = (id, callback) => {
  let cntxtDtls = "Get admin_reverted_list_delete api";
  QRY_TO_EXEC = `delete from reverted_stud_csv_admin_t where id in (?);`;
  dbutil.execQuery(
    sqldb.MySQLConPool,
    QRY_TO_EXEC,
    cntxtDtls,
    [id],
    function (err, results) {
      if (err) {
        callback(err, 0);
        return;
      } else {
        callback(err, results);
        return;
      }
    }
  );
};

exports.advisor_create_student = (email, password, callback) => {
  let cntxtDtls = "Get advisor_todo_row_save api";
  QRY_TO_EXEC = `insert into users_dtl_t(user_name,phone_no,email,pwd,c_by,role) values(?)`;
  let values = [username, phoneNumber, email, password, created_user_id, 4];
  dbutil.execQuery(
    sqldb.MySQLConPool,
    QRY_TO_EXEC,
    cntxtDtls,
    [values],
    function (err, results) {
      if (err) {
        callback(err, 0);
        return;
      } else {
        callback(err, results);
        return;
      }
    }
  );
};

exports.login_new = (email, password, callback) => {
  let cntxtDtls = "Get login_new api";
  QRY_TO_EXEC = `SELECT * FROM user_new where email=?`;
  dbutil.execQuery(
    sqldb.MySQLConPool,
    QRY_TO_EXEC,
    cntxtDtls,
    [email],
    function (err, results) {
      if (err) {
        callback(err, 0);
        return;
      } else {
        if (results.length == 0) {
          callback(0, null, 1);
          return;
        } else {
          QRY_TO_EXEC = `SELECT * FROM user_new where email=? and pwd=? `;
          dbutil.execQuery(
            sqldb.MySQLConPool,
            QRY_TO_EXEC,
            cntxtDtls,
            [email, password],
            function (err, results1) {
              if (results1 == 0) {
                callback(err, null, 2);
                return;
              } else {
                callback(err, results1);
                return;
              }
            }
          );
        }
      }
    }
  );
};

exports.trackProcess = (advisor_id, callback) => {
  let cntxtDtls = "Get trackProcess api";
  QRY_TO_EXEC = `SELECT r.id as prima,r.*,u.*,stu.* FROM reverted_stud_csv_admin_t  as r
left join users_dtl_t as u on u.email=r.email_id
left join student_dtl_t as stu on stu.c_by=u.id
where student_interest="Yes" and assign_indicator=1 and assigned_to=?;`;
  dbutil.execQuery(
    sqldb.MySQLConPool,
    QRY_TO_EXEC,
    cntxtDtls,
    [advisor_id],
    function (err, results) {
      if (err) {
        callback(err, 0);
        return;
      } else {
        if (results.length == 0) {
          callback(err, results, 1);
          return;
        } else {
          results.forEach(async function (element, index) {
            console.log(element, "***");
            let documents = {};
            Object.assign(documents, {
              tenth: results[index].tenth,
              inter: results[index].inter,
              btech: results[index].deg_btech,
              masters: results[index].masters,
            });
            results[index]["documents"] = documents;
            setTimeout(() => {
              callback(err, results);
              return;
            }, 2000);
          });
        }
      }
    }
  );
};

exports.count_check_advisor_form = (advisor_id, entered_count, callback) => {
  let cntxtDtls = "Get count_check_advisor_form api";
  QRY_TO_EXEC = `SELECT * FROM reverted_stud_csv_admin_t
where student_interest="Yes" and assign_indicator=1 and assigned_to=?;`;
  dbutil.execQuery(
    sqldb.MySQLConPool,
    QRY_TO_EXEC,
    cntxtDtls,
    [advisor_id],
    function (err, results) {
      console.log(results.length, "$$$$", entered_count);

      if (err) {
        callback(err, 0);
        return;
      } else {
        if (results.length == 0) {
          callback(err, results, 1);
          return;
        } else {
          if (entered_count > results.length) {
            callback(err, results.length, 2);
            return;
          } else {
            callback(err, results);
            return;
          }
        }
      }
    }
  );
};

exports.advisor_form_studNames_dropdown = (
  advisor_id,
  selected_student_id,
  callback
) => {
  let cntxtDtls = "Get advisor_form_studNames_dropdown api";
  QRY_TO_EXEC = `SELECT id,Studen_Name,email_id FROM reverted_stud_csv_admin_t
where student_interest="Yes" and assign_indicator=1 and assigned_to=? and id not in (?);`;
  dbutil.execQuery(
    sqldb.MySQLConPool,
    QRY_TO_EXEC,
    cntxtDtls,
    [advisor_id, selected_student_id],
    function (err, results) {
      console.log(results.length, "$$$$", selected_student_id);

      if (err) {
        callback(err, 0);
        return;
      } else {
        callback(err, results);
        return;
      }
    }
  );
};

exports.advisor_formAssign_submit_button = (data, logged_user_id, callback) => {
  let cntxtDtls = "Get advisor_formAssign_submit_button api";
  let update_query = [];
  let cnt = 0;
  data.forEach(async function (element, index) {
    cnt++;
    console.log(element.selected_student_id, element.selected_incubator_id);

    await update_query.push([
      `update reverted_stud_csv_admin_t set assigned_to='${element.selected_incubator_id}',assigned_by=${logged_user_id},assign_indicator=0,student_interest=null where id=${element.selected_student_id};`,
    ]);

    // QRY_TO_EXEC = `update reverted_stud_csv_admin_t set assigned_to=?,assigned_by=?,assign_indicator=0,student_interest=null where id=?`
    // dbutil.execQuery(sqldb.MySQLConPool, QRY_TO_EXEC, cntxtDtls, [element.selected_student_id, element.selected_incubator_id], function (err, results) {
    // })
  });
  if (cnt == data.length) {
    let update_query_res = update_query.join("");
    dbutil.execQuery(
      sqldb.MySQLConPool,
      update_query_res,
      cntxtDtls,
      [],
      function (err, update_results) {
        callback(err, update_results);
        return;
      }
    );
  }

  return;
  QRY_TO_EXEC = ``;
  dbutil.execQuery(
    sqldb.MySQLConPool,
    QRY_TO_EXEC,
    cntxtDtls,
    [],
    function (err, results) {
      console.log(results.length, "$$$$", selected_student_id);

      if (err) {
        callback(err, 0);
        return;
      } else {
        callback(err, results);
        return;
      }
    }
  );
};

exports.edit_profile = (logged_user_id, user_name, phone_number, callback) => {
  let cntxtDtls = "Get edit_profile api";
  QRY_TO_EXEC = `update users_dtl_t set user_name=?,phone_no=? where id=?;`;
  dbutil.execQuery(
    sqldb.MySQLConPool,
    QRY_TO_EXEC,
    cntxtDtls,
    [user_name, phone_number, logged_user_id],
    function (err, results) {
      if (err) {
        callback(err, 0);
        return;
      } else {
        callback(err, results);
        return;
      }
    }
  );
};

exports.change_password = (new_password, logged_user_id, callback) => {
  let cntxtDtls = "Get change_password api";
  QRY_TO_EXEC = `update users_dtl_t set pwd=? where id=?;`;
  dbutil.execQuery(
    sqldb.MySQLConPool,
    QRY_TO_EXEC,
    cntxtDtls,
    [new_password, logged_user_id],
    function (err, results) {
      if (err) {
        callback(err, 0);
        return;
      } else {
        callback(err, results);
        return;
      }
    }
  );
};

exports.advisor_approve_reject_documents = (c_by, status, callback) => {
  let cntxtDtls = "Get advisor_approve_reject_documents api";
  QRY_TO_EXEC = `update student_dtl_t  set status='${status}' where c_by=${c_by};`;
  dbutil.execQuery(
    sqldb.MySQLConPool,
    QRY_TO_EXEC,
    cntxtDtls,
    [],
    function (err, results) {
      if (err) {
        callback(err, 0);
        return;
      } else {
        callback(err, results);
        return;
      }
    }
  );
};

exports.advisor_assignto_consultant = (
  consultant_id,
  logged_user_id,
  prima,
  callback
) => {
  let cntxtDtls = "Get advisor_assignto_consultant api";
  let current_timestamp = moment().format("YYYY-MM-DD");
  QRY_TO_EXEC = `update reverted_stud_csv_admin_t  set assigned_to='${consultant_id}',assigned_by='${logged_user_id}', assigned_time="${current_timestamp}"
     where id=${prima};`;
  dbutil.execQuery(
    sqldb.MySQLConPool,
    QRY_TO_EXEC,
    cntxtDtls,
    [],
    function (err, results) {
      if (err) {
        callback(err, 0);
        return;
      } else {
        callback(err, results);
        return;
      }
    }
  );
};

exports.consultant_get_details = (logged_user_id, callback) => {
  let cntxtDtls = "Get advisor_assignto_consultant api";
  // QRY_TO_EXEC = `select * from reverted_stud_csv_admin_t where assigned_to=${logged_user_id}`
  QRY_TO_EXEC = ` SELECT r.id as primarykey,u1.role as assigned_role,u1.user_name as assigned_by_name,u1.id as assigned_id,r.assigned_time,r.*, u.*, stu.* FROM reverted_stud_csv_admin_t as r
  left join users_dtl_t as u on u.email = r.email_id
  left join users_dtl_t as u1 on u1.id = r.assigned_by
  left join student_dtl_t as stu on stu.c_by = u.id
where student_interest = "Yes" and assign_indicator = 1 and track_in_progress=0 and assigned_to =${logged_user_id};`;
  dbutil.execQuery(
    sqldb.MySQLConPool,
    QRY_TO_EXEC,
    cntxtDtls,
    [],
    function (err, results) {
      if (err) {
        callback(err, 0);
        return;
      } else {
        if (results.length == 0) {
          callback(err, results, 1);
          return;
        } else {
          results.forEach(async function (element, index) {
            console.log(element, "***");
            let documents = {};
            Object.assign(documents, {
              tenth: results[index].tenth,
              inter: results[index].inter,
              btech: results[index].deg_btech,
              masters: results[index].masters,
            });
            results[index]["documents"] = documents;
            setTimeout(() => {
              callback(err, results);
              return;
            }, 2000);
          });
        }
      }
    }
  );
};

exports.student_upload_submit = (
  Process_fee,
  Application_Fee,
  SSC,
  Intermediate,
  Btech_Degree_PC,
  Btech_Degree_CMM,
  Btech_Degree_OD,
  B_Tech_Sem,
  GRE,
  LOR,
  Resume,
  SOP,
  Work_Experience,
  Passport_Front,
  Passport_back,
  TOEFL_Doc,
  GRE_Doc,
  IELTS_Doc,
  Duolingo_Doc,
  other_Language,
  Bank_statement,
  fund_letter,
  Experience_letter,
  multiple_record_file,
  logged_user_id,
  callback
) => {
  let cntxtDtls = "Get student_upload_submit api";
  let current_timestamp = moment().format("YYYY-MM-DD HH:mm:ss");
  let query = `select * from student_dtl_t where c_by=${logged_user_id}`;
  dbutil.execQuery(
    sqldb.MySQLConPool,
    query,
    cntxtDtls,
    [],
    function (err, results) {
      let ssc_query = "";
      if (Process_fee == 1) {
        let a = "Process_fee";
        ssc_query = `,Process_fee='${multiple_record_file}'`;
        ssc_queryu = a;
      }
      if (Application_Fee == 1) {
        let a = "Application_Fee";
        ssc_query = `,Application_Fee='${multiple_record_file}'`;
        ssc_queryu = a;
      }
      if (SSC == 1) {
        let a = "SSC";
        ssc_query = `,SSC='${multiple_record_file}'`;
        ssc_queryu = a;
      }
      if (Intermediate == 1) {
        let a = "Intermediate";
        ssc_query = `,Intermediate='${multiple_record_file}'`;
        ssc_queryu = a;
      }
      if (Btech_Degree_PC == 1) {
        let a = "Btech_Degree_PC";
        ssc_query = `,Btech_Degree_PC='${multiple_record_file}'`;
        ssc_queryu = a;
      }
      if (Btech_Degree_CMM == 1) {
        let a = "Btech_Degree_CMM";
        ssc_query = `,Btech_Degree_CMM='${multiple_record_file}'`;
        ssc_queryu = a;
      }
      if (Btech_Degree_OD == 1) {
        let a = "Btech_Degree_OD";
        ssc_query = `,Btech_Degree_OD='${multiple_record_file}'`;
        ssc_queryu = a;
      }
      if (B_Tech_Sem == 1) {
        let a = "B_Tech_Sem";
        ssc_query = `,B_Tech_Sem='${multiple_record_file}'`;
        ssc_queryu = a;
      }
      if (GRE == 1) {
        let a = "gre";
        ssc_query = `,gre='${multiple_record_file}'`;
        ssc_queryu = a;
      }
      if (LOR == 1) {
        let a = "LOR";
        ssc_query = `,LOR='${multiple_record_file}'`;
        ssc_queryu = a;
      }
      if (Resume == 1) {
        let a = "Resume";
        ssc_query = `,Resume='${multiple_record_file}'`;
        ssc_queryu = a;
      }
      if (SOP == 1) {
        let a = "SOP";
        ssc_query = `,SOP='${multiple_record_file}'`;
        ssc_queryu = a;
      }

      if (Work_Experience == 1) {
        let a = "Work_Experience";
        ssc_query = `,Work_Experience='${multiple_record_file}'`;
        ssc_queryu = a;
      }
      if (Passport_Front == 1) {
        let a = "Passport_Front";
        ssc_query = `,Passport_Front='${multiple_record_file}'`;
        ssc_queryu = a;
      }
      if (Passport_back == 1) {
        let a = "Passport_back";
        ssc_query = `,Passport_back='${multiple_record_file}'`;
        ssc_queryu = a;
      }
      if (TOEFL_Doc == 1) {
        let a = "TOEFL_Doc";
        ssc_query = `,TOEFL_Doc='${multiple_record_file}'`;
        ssc_queryu = a;
      }
      if (GRE_Doc == 1) {
        let a = "GRE_Doc";
        ssc_query = `,GRE_Doc='${multiple_record_file}'`;
        ssc_queryu = a;
      }
      if (IELTS_Doc == 1) {
        let a = "IELTS_Doc";
        ssc_query = `,IELTS_Doc='${multiple_record_file}'`;
        ssc_queryu = a;
      }
      if (Duolingo_Doc == 1) {
        let a = "Duolingo_Doc";
        ssc_query = `,Duolingo_Doc='${multiple_record_file}'`;
        ssc_queryu = a;
      }
      if (other_Language == 1) {
        let a = "other_Language";
        ssc_query = `,other_Language='${multiple_record_file}'`;
        ssc_queryu = a;
      }
      if (Bank_statement == 1) {
        let a = "Bank_statement";
        ssc_query = `,Bank_statement='${multiple_record_file}'`;
        ssc_queryu = a;
      }
      if (fund_letter == 1) {
        let a = "fund_letter";
        ssc_query = `,fund_letter='${multiple_record_file}'`;
        ssc_queryu = a;
      }
      if (Experience_letter == 1) {
        let a = "Experience_letter";
        ssc_query = `,Experience_letter='${multiple_record_file}'`;
        ssc_queryu = a;
      }

      if (results.length > 0) {
        QRY_TO_EXEC = `update student_dtl_t set c_ts="${current_timestamp}" ${ssc_query} where c_by=${logged_user_id}`;
      } else {
        QRY_TO_EXEC = `insert into student_dtl_t (${ssc_queryu},c_by) values(?)`;
      }
      let values = [multiple_record_file, logged_user_id];
      dbutil.execQuery(
        sqldb.MySQLConPool,
        QRY_TO_EXEC,
        cntxtDtls,
        [values],
        function (err, results) {
          if (err) {
            callback(err, 0);
            return;
          } else {
            query = `select * from student_dtl_t where c_by=${logged_user_id} and
(SSC is  not null and Intermediate is not null)`;
            dbutil.execQuery(
              sqldb.MySQLConPool,
              query,
              cntxtDtls,
              [values],
              function (err, res18) {
                if (res18.length == 0) {
                  callback(err, results);
                  return;
                } else {
                  query = `update student_dtl_t set status="Submitted" where c_by=${logged_user_id}`;
                  dbutil.execQuery(
                    sqldb.MySQLConPool,
                    query,
                    cntxtDtls,
                    [values],
                    function (err, res18) {
                      callback(err, results);
                      return;
                    }
                  );
                }
              }
            );
          }
        }
      );
    }
  );

  return;
  if (indicator == "SSC") {
    let query = `select * from student_dtl_t where c_by=${logged_user_id}`;
    dbutil.execQuery(
      sqldb.MySQLConPool,
      query,
      cntxtDtls,
      [],
      function (err, results) {
        if (results.length > 0) {
          QRY_TO_EXEC = `update student_dtl_t set tenth='${multiple_record_file}' where c_by=${logged_user_id}`;
        } else {
          QRY_TO_EXEC = `insert into student_dtl_t (tenth,c_by) values(?)`;
        }
        let values = [multiple_record_file, logged_user_id];
        dbutil.execQuery(
          sqldb.MySQLConPool,
          QRY_TO_EXEC,
          cntxtDtls,
          [values],
          function (err, results) {
            if (err) {
              callback(err, 0);
              return;
            } else {
              query = `select * from student_dtl_t where c_by=${logged_user_id} and
 (tenth is  not null and inter is not null and deg_btech is not null and
 masters is not null)`;
              dbutil.execQuery(
                sqldb.MySQLConPool,
                query,
                cntxtDtls,
                [values],
                function (err, res18) {
                  if (res18.length == 0) {
                    callback(err, results);
                    return;
                  } else {
                    query = `update student_dtl_t set status="Submitted" where c_by=${logged_user_id}`;
                    dbutil.execQuery(
                      sqldb.MySQLConPool,
                      query,
                      cntxtDtls,
                      [values],
                      function (err, res18) {
                        callback(err, results);
                        return;
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
    );
  }
  if (indicator == "Intermediate") {
    let query = `select * from student_dtl_t where c_by=${logged_user_id}`;
    dbutil.execQuery(
      sqldb.MySQLConPool,
      query,
      cntxtDtls,
      [],
      function (err, results) {
        if (results.length > 0) {
          QRY_TO_EXEC = `update student_dtl_t set inter='${multiple_record_file}' where c_by=${logged_user_id}`;
        } else {
          QRY_TO_EXEC = `insert into student_dtl_t (inter,c_by) values(?)`;
        }
        let values = [multiple_record_file, logged_user_id];
        dbutil.execQuery(
          sqldb.MySQLConPool,
          QRY_TO_EXEC,
          cntxtDtls,
          [values],
          function (err, results) {
            if (err) {
              callback(err, 0);
              return;
            } else {
              query = `select * from student_dtl_t where c_by=${logged_user_id} and
  (tenth is  not null and inter is not null and deg_btech is not null and
 masters is not null)`;
              dbutil.execQuery(
                sqldb.MySQLConPool,
                query,
                cntxtDtls,
                [values],
                function (err, res18) {
                  if (res18.length == 0) {
                    callback(err, results);
                    return;
                  } else {
                    query = `update student_dtl_t set status="Submitted" where c_by=${logged_user_id}`;
                    dbutil.execQuery(
                      sqldb.MySQLConPool,
                      query,
                      cntxtDtls,
                      [values],
                      function (err, res18) {
                        callback(err, results);
                        return;
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
    );
  }
  if (indicator == "Degree/Btech") {
    let query = `select * from student_dtl_t where c_by=${logged_user_id}`;
    dbutil.execQuery(
      sqldb.MySQLConPool,
      query,
      cntxtDtls,
      [],
      function (err, results) {
        if (results.length > 0) {
          QRY_TO_EXEC = `update student_dtl_t set deg_btech='${multiple_record_file}' where c_by=${logged_user_id}`;
        } else {
          QRY_TO_EXEC = `insert into student_dtl_t (deg_btech,c_by) values(?)`;
        }
        let values = [multiple_record_file, logged_user_id];
        dbutil.execQuery(
          sqldb.MySQLConPool,
          QRY_TO_EXEC,
          cntxtDtls,
          [values],
          function (err, results) {
            if (err) {
              callback(err, 0);
              return;
            } else {
              query = `select * from student_dtl_t where c_by=${logged_user_id} and
  (tenth is  not null and inter is not null and deg_btech is not null and
 masters is not null)`;
              dbutil.execQuery(
                sqldb.MySQLConPool,
                query,
                cntxtDtls,
                [values],
                function (err, res18) {
                  if (res18.length == 0) {
                    callback(err, results);
                    return;
                  } else {
                    query = `update student_dtl_t set status="Submitted" where c_by=${logged_user_id}`;
                    dbutil.execQuery(
                      sqldb.MySQLConPool,
                      query,
                      cntxtDtls,
                      [values],
                      function (err, res18) {
                        callback(err, results);
                        return;
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
    );
  }
  if (indicator == "Masters") {
    let query = `select * from student_dtl_t where c_by=${logged_user_id}`;
    dbutil.execQuery(
      sqldb.MySQLConPool,
      query,
      cntxtDtls,
      [],
      function (err, results) {
        if (results.length > 0) {
          QRY_TO_EXEC = `update student_dtl_t set masters='${multiple_record_file}' where c_by=${logged_user_id}`;
        } else {
          QRY_TO_EXEC = `insert into student_dtl_t (masters,c_by) values(?)`;
        }
        let values = [multiple_record_file, logged_user_id];
        dbutil.execQuery(
          sqldb.MySQLConPool,
          QRY_TO_EXEC,
          cntxtDtls,
          [values],
          function (err, results) {
            if (err) {
              callback(err, 0);
              return;
            } else {
              query = `select * from student_dtl_t where c_by=${logged_user_id} and
  (tenth is  not null and inter is not null and deg_btech is not null and
 masters is not null)`;
              dbutil.execQuery(
                sqldb.MySQLConPool,
                query,
                cntxtDtls,
                [values],
                function (err, res18) {
                  if (res18.length == 0) {
                    callback(err, results);
                    return;
                  } else {
                    query = `update student_dtl_t set status="Submitted" where c_by=${logged_user_id}`;
                    dbutil.execQuery(
                      sqldb.MySQLConPool,
                      query,
                      cntxtDtls,
                      [values],
                      function (err, res18) {
                        callback(err, results);
                        return;
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
    );
  }
};

exports.student_upload_get = (logged_user_id, callback) => {
  let cntxtDtls = "Get student_upload_get api";
  QRY_TO_EXEC = `select * from student_dtl_t where c_by='${logged_user_id}'`;
  dbutil.execQuery(
    sqldb.MySQLConPool,
    QRY_TO_EXEC,
    cntxtDtls,
    [],
    function (err, results) {
      if (err) {
        callback(err, 0);
        return;
      } else {
        callback(err, results);
        return;
      }
    }
  );
};

exports.student_profile_edit = (
  name,
  mobile_number,
  interest_state,
  degree_passed_year,
  courses,
  marks,
  logged_user_id,
  callback
) => {
  let cntxtDtls = "Get student_profile_edit api";
  console.log(courses, "courses");
  let current_timestamp = moment().format("YYYY-MM-DD");
  QRY_TO_EXEC = `update users_dtl_t set user_name="${name}",phone_no="${mobile_number}",
    interest_state="${interest_state}",passed_year="${degree_passed_year}",
courses ="${courses}",course_mark="${marks}",u_ts="${current_timestamp}" where id=${logged_user_id}`;
  // `insert into users_dtl_t(user_name,phone_no,interest_state,passed_year,courses,course_mark,u_ts)
  // values('${name}', '${mobile_number}', '${interest_state}', '${degree_passed_year}', '${courses}', '${marks}');`
  dbutil.execQuery(
    sqldb.MySQLConPool,
    QRY_TO_EXEC,
    cntxtDtls,
    [],
    function (err, results) {
      if (err) {
        callback(err, 0);
        return;
      } else {
        callback(err, results);
        return;
      }
    }
  );
};

exports.consultant_track_progress_button = (primary_id, callback) => {
  let cntxtDtls = "Get consultant_track_progress_button api";
  QRY_TO_EXEC = `update reverted_stud_csv_admin_t set track_in_progress=1 where id=${primary_id};`;
  dbutil.execQuery(
    sqldb.MySQLConPool,
    QRY_TO_EXEC,
    cntxtDtls,
    [],
    function (err, results) {
      if (err) {
        callback(err, 0);
        return;
      } else {
        callback(err, results);
        return;
      }
    }
  );
};

exports.track_progress_get = (callback) => {
  let cntxtDtls = "Get track_progress_get api";
  QRY_TO_EXEC = `SELECT re.id as primaryKey,u1.role as assigned_role,u1.user_name as assigned_by_name,u1.id as assigned_id,re.assigned_time,re.*, u.* FROM reverted_stud_csv_admin_t as re
  left join users_dtl_t as u on u.email = re.email_id
  left join users_dtl_t as u1 on u1.id = re.assigned_by
  where track_in_progress=1;`;
  dbutil.execQuery(
    sqldb.MySQLConPool,
    QRY_TO_EXEC,
    cntxtDtls,
    [],
    function (err, results) {
      if (err) {
        callback(err, 0);
        return;
      } else {
        callback(err, results);
        return;
      }
    }
  );
};

exports.track_progress_save = (
  choosen_universites,
  choosen_comments,
  primary_id,
  callback
) => {
  let cntxtDtls = "Get track_progress_save api";
  QRY_TO_EXEC = `update reverted_stud_csv_admin_t set choosen_universites="${choosen_universites}",choosen_comments="${choosen_comments}" where id=${primary_id}`;
  dbutil.execQuery(
    sqldb.MySQLConPool,
    QRY_TO_EXEC,
    cntxtDtls,
    [],
    function (err, results) {
      if (err) {
        callback(err, 0);
        return;
      } else {
        qry = `SELECT re.id as primaryKey,u1.role as assigned_role,u1.user_name as assigned_by_name,u1.id as assigned_id,re.assigned_time,re.*, u.* FROM reverted_stud_csv_admin_t as re
        left join users_dtl_t as u on u.email = re.email_id
        left join users_dtl_t as u1 on u1.id = re.assigned_by
        where track_in_progress=1;`;
        dbutil.execQuery(
          sqldb.MySQLConPool,
          qry,
          cntxtDtls,
          [],
          function (err, results1) {
            callback(err, results1);
            return;
          }
        );
      }
    }
  );
};
exports.track_progress_save_button = (
  primary_id,
  choosen_university,
  choosen_comments,
  callback
) => {
  let cntxtDtls = "Get track_progress_save_button api";
  let current_timestamp = moment().format("YYYY-MM-DD");
  QRY_TO_EXEC = `update reverted_stud_csv_admin_t set track_in_progress=2,choosen_universites="${choosen_university}",choosen_comments="${choosen_comments}",cons_admin_trackdate="${current_timestamp}"
   where id=${primary_id};`;
  dbutil.execQuery(
    sqldb.MySQLConPool,
    QRY_TO_EXEC,
    cntxtDtls,
    [],
    function (err, results) {
      if (err) {
        callback(err, 0);
        return;
      } else {
        callback(err, results);
        return;
      }
    }
  );
};

exports.admin_trackprocess_get = (callback) => {
  let cntxtDtls = "Get track_progress_get api";
  QRY_TO_EXEC = `  SELECT u2.user_name as consultant_name,u1.user_name as advisor_name,re.assigned_time as advisor_submit_toConsultant,re.cons_admin_trackdate as Consultant_submitted_date_toadmin,u.*,re.* FROM reverted_stud_csv_admin_t as re
  left join users_dtl_t as u on u.email = re.email_id
    left join users_dtl_t as u1 on u1.id = re.assigned_by
      left join users_dtl_t as u2 on u2.id = re.assigned_to
  where track_in_progress=2;`;
  dbutil.execQuery(
    sqldb.MySQLConPool,
    QRY_TO_EXEC,
    cntxtDtls,
    [],
    function (err, results) {
      if (err) {
        callback(err, 0);
        return;
      } else {
        callback(err, results);
        return;
      }
    }
  );
};

exports.student_payment_mode = (logged_user_id, payment_mode, callback) => {
  let cntxtDtls = "Get student_payment_mode api";
  QRY_TO_EXEC = `update users_dtl_t set payment_mode="${payment_mode}" where id=${logged_user_id};`;
  dbutil.execQuery(
    sqldb.MySQLConPool,
    QRY_TO_EXEC,
    cntxtDtls,
    [],
    function (err, results) {
      if (err) {
        callback(err, 0);
        return;
      } else {
        callback(err, results);
        return;
      }
    }
  );
};
