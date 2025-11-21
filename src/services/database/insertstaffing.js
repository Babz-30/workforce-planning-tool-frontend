const { MongoClient } = require("mongodb");

async function run() {
  const uri =
    "mongodb+srv://agile:aYswb1Evr6UwnF17@cluster0.wymdy.mongodb.net/?appName=Cluster0"; // change if needed
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const db = client.db("workForceManagementDB");
    const collection = db.collection("staffing");

    // ---- PASTE YOUR 10 RECORDS INSIDE THIS ARRAY ----
    //    {
    //   projectId: "PROJ1001A",
    //   appliedEmployees: ["EMP001", "EMP002"],
    //   approvedEmployees: ["EMP003"],
    //   rejectedEmployees: ["EMP004"],
    // },
    const records = [
      {
        projectId: "PROJ1002",
        appliedEmployees: [
          {
            employeeId: "EMP010",
          },
        ],
        approvedEmployees: [
          {
            employeeId: "EMP011",
          },
        ],
        rejectedEmployees: [],
      },

      {
        projectId: "PROJ1003",
        appliedEmployees: [
          {
            employeeId: "EMP020",
          },
          {
            employeeId: "EMP021",
          },
        ],
        approvedEmployees: [],
        rejectedEmployees: [
          {
            employeeId: "EMP022",
          },
        ],
      },

      {
        projectId: "PROJ1004",
        appliedEmployees: [],
        approvedEmployees: [
          {
            employeeId: "EMP030",
          },
        ],
        rejectedEmployees: [],
      },

      {
        projectId: "PROJ1005",
        appliedEmployees: [
          {
            employeeId: "EMP040",
          },
        ],
        approvedEmployees: [],
        rejectedEmployees: [
          {
            employeeId: "EMP041",
          },
        ],
      },

      {
        projectId: "PROJ1006",
        appliedEmployees: [
          {
            employeeId: "EMP050",
          },
          {
            employeeId: "EMP051",
          },
        ],
        approvedEmployees: [
          {
            employeeId: "EMP052",
          },
        ],
        rejectedEmployees: [],
      },

      {
        projectId: "PROJ1007",
        appliedEmployees: [
          {
            employeeId: "EMP060",
          },
        ],
        approvedEmployees: [],
        rejectedEmployees: [
          {
            employeeId: "EMP061",
          },
        ],
      },

      {
        projectId: "PROJ1008",
        appliedEmployees: [
          {
            employeeId: "EMP070",
          },
        ],
        approvedEmployees: [
          {
            employeeId: "EMP071",
          },
        ],
        rejectedEmployees: [],
      },

      {
        projectId: "PROJ1009",
        appliedEmployees: [],
        approvedEmployees: [],
        rejectedEmployees: [
          {
            employeeId: "EMP080",
          },
        ],
      },

      {
        projectId: "PROJ1010",
        appliedEmployees: [
          {
            employeeId: "EMP090",
          },
          {
            employeeId: "EMP091",
          },
        ],
        approvedEmployees: [
          {
            employeeId: "EMP092",
          },
        ],
        rejectedEmployees: [
          {
            employeeId: "EMP093",
          },
        ],
      },
    ];

    // --------------------------------------------------

    const result = await collection.insertMany(records);
    console.log(`Inserted ${result.insertedCount} records`);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
