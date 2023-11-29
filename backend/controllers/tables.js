const pool = require("../database/pool");

const getAllTableNames = async (req, res) => {
  try {
    const [rows, fields] = await pool.query(`SHOW tables FROM camera_chess`);
    console.log(rows);
    const names = rows.map((row) => {
      return row.Tables_in_camera_chess;
    });
    return res.status(200).json({
      success: 1,
      data: names,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: 0,
      message: "something has broken",
    });
  }
};

module.exports = {
  getAllTableNames,
};
