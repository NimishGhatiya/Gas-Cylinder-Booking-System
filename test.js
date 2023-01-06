const test = [
  {
    _id: "63ac3181232b998b1b373bb5",
    Title: "porduct1",
    Size: "5Kg",
    Rating: 2,
    Type: "gas_Cylnder",
    Total_Cylinders: [{}],
    Company: [
      {
        Name: "GDGSGD",
      },
    ],
  },
  {
    _id: "63ac33c53f71ba56ee780b3c",
    Title: "porduct1",
    Size: "5Kg",
    Rating: 2,
    Type: "gas_Cylnder",
    Total_Cylinders: [
      {
        TotalCylinders: 2,
      },
    ],
    Company: [
      {
        Name: "GDGSGD",
      },
    ],
  },
];

let responseArray = [];

for (let item of test) {
  if ((item.Total_Cylinders[0] = "Null")) {
    let respObj = {
      Title: item.Title,
      Size: item.Size,
      Rating: item.Rating,
      Type: item.Type,
      Total_Cylinders: item.Total_Cylinders[0].TotalCylinders,
      Company: item.Company[0].Name,
    };
    responseArray.push(respObj);
    respObj = {};
    console.log("Nimish");
  } else {
    let respObj = {
      Title: item.Title,
      Size: item.Size,
      Rating: item.Rating,
      Type: item.Type,
      Total_Cylinders: "Null",
      Company: item.Company[0].Name,
    };
    responseArray.push(respObj);
    respObj = {};
    console.log("ghat");
  }
}
console.log(responseArray);
