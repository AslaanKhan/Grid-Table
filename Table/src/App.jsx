
import { AddIcon } from "./assets/AddSVG";
import { CloseSVG } from "./assets/XSVG";
import { FunnelSVG } from "./assets/FunnelSVG";
import { RefreshIcon } from "./assets/RefreshSVG";
import { RemoveIcon } from "./assets/RemoveSVG";
import React, { useEffect, useState } from "react";

function App() {
  const [expandedRows, setExpandedRows] = useState([]);
  const [row, setRow] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [insideselectedRows, setInsideSelectedRows] = useState([]);
  const [autosave, setAutoSave] = useState(0);
  const [ids, setIds] = useState(0);
  const [displayedRow,setDisplayedRow] = useState([])

  
  useEffect(() => {
    console.log(row, "Row");
    console.log(displayedRow, "DRow");
  }, [row,displayedRow]);

  useEffect(()=>{ 
    autosave === 0 && setRow(displayedRow)
  },[autosave])

  const handleCheckboxChange = (rowId) => {
    const updateSelectedRows = (prevSelectedRows) => {
      if (prevSelectedRows.includes(rowId)) {
        return rowId === -1
          ? []
          : prevSelectedRows.filter((id) => id !== rowId);
      } else {
        return rowId === -1
          ? [...row.map((e) => e.id), rowId]
          : [...prevSelectedRows, rowId];
      }
    };

    setSelectedRows(updateSelectedRows);
  };

  const handleInsideCheckboxChange = (rowId, mainId) => {
    const updateInsideSelectedRows = (prevSelectedRows) => {
      if (prevSelectedRows.includes(rowId)) {
        return rowId === -1
          ? []
          : prevSelectedRows.filter((id) => id !== rowId);
      } else {
        return rowId === -1
          ? [...row[mainId]?.ApointmentData.map((e) => e.id), rowId]
          : [...prevSelectedRows, rowId];
      }
    };

    setInsideSelectedRows(updateInsideSelectedRows);
  };

  const handleRowExpand = (index) => {
    setExpandedRows((prevExpandedRows) => {
      if (prevExpandedRows.includes(index)) {
        return prevExpandedRows.filter((i) => i !== index);
      } else {
        return [...prevExpandedRows, index];
      }
    });
  };

  const addRow = () => {
    setRow((prevRow) => [
      ...prevRow,
      {
        id: ids + 1,
        Name: "",
        Date: "",
        "Appointment Library": "",
        ApointmentData: [
          {
            id: 1,
            Subject: "",
            "Created On": "",
            Doctor: "",
            "Start Time": "",
            "End Time": "",
            Decription: "",
          },
        ],
      },
    ]);
    setIds(ids + 1);
  };

  const addAppointmentData = (i) => {
    setRow((prevRow) => {
      const newRow = [...prevRow];
      const updatedRow = {
        ...newRow[i],
        ApointmentData: [
          ...newRow[i].ApointmentData,
          {
            id: newRow[i].ApointmentData.length + 1,
            Subject: "",
            "Created On": "",
            Doctor: "",
            "Start Time": "",
            "End Time": "",
            Decription: "",
          },
        ],
      };
      newRow[i] = updatedRow;
      return newRow;
    });
  };

  const removeRow = () => {
    autosave === 1 ? setDisplayedRow((prevRow) => prevRow.filter((row) => !selectedRows.includes(row.id))) : setRow((prevRow) => prevRow.filter((row) => !selectedRows.includes(row.id)));

    setSelectedRows([]);
  };

  function RemoveAppointmentData(mainIndex) {
    // Remove selected rows from the AppointmentData array
    setRow((prevData) =>
      prevData.map((row, index) =>
        index === mainIndex
          ? { ...row, ApointmentData: row.ApointmentData.filter((data) => !insideselectedRows.includes(data.id)) }
          : row
      )
    );
    // Clear the selected rows in the second table
    setInsideSelectedRows([]);
  }

  const handleCellChange = (rowId, key, value) => {
    setRow((prevRow) =>
      prevRow.map((row) =>
        row.id === rowId ? { ...row, [key]: value } : row
      )
    );
  };

  function reloadTable() {
    // Keep the existing data in the rows and reset other state variables
    setRow([]);
    setSelectedRows([]);
    setInsideSelectedRows([]);
    setAutoSave(0);
    setIds(0);
    setExpand(null)
    // You might want to add logic here to fetch updated data if needed
  }

  return (
    <div className="mx-auto max-w-[80%]">
      <div className="flex justify-between w-full border-b-2 mb-1  px-2 mb-4">
        <div className="font-bold flex gap-[5px] text-[15px]">
          Patient Appointment Bundle -
          <div className="font-normal">
            Total Records {row?.length || "0"}
          </div>
          <div className="flex gap-[5px] t px-2">
            |{" "}
            <div onClick={addRow}>
              <AddIcon />
            </div>{" "}
            <div onClick={removeRow}>
              <CloseSVG />
            </div>
            <FunnelSVG />
            <div onClick={reloadTable}>
              <RefreshIcon />
            </div>
            <div
              className="bg-sky-800 text-white cursor-pointer"
              onClick={() => {setAutoSave(autosave === 0 && 1 || 0);setDisplayedRow(row);console.log(displayedRow) }}
            >
              {autosave === 0 ? "Auto Save On" : `Auto Save Off`}
            </div>
          </div>
        </div>
      </div>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className=" flex px-6 py-3">
                <input
                  className="mr-2"
                  type="checkbox"
                  onChange={() => handleCheckboxChange(-1)}
                  checked={selectedRows.includes(-1)}
                />
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Appointment Library
              </th>
            </tr>
          </thead>
          <tbody>
            {row?.map((e, index) => (
              <>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 w-fit">
                  <th
                    scope="row"
                    className="flex px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white w-fit"
                  >
                    {" "}
                    <input
                      type="checkbox"
                      onChange={() => handleCheckboxChange(e.id)}
                      checked={selectedRows.includes(e.id)}
                    />
                    <div>
                    {(expandedRows.includes(index) && (
                  <div onClick={() => handleRowExpand(index)}>
                    <RemoveIcon />
                  </div>
                )) || (
                  <div onClick={() => handleRowExpand(index)}>
                    <AddIcon />
                  </div>
                )}
                    </div>
                    <input
                      className="appearance-none bg-transparent border-none text-sm text-gray-700 mr-3 py-1 px-2 "
                      type="text"
                      value={autosave === 0 && e?.Name || ''}
                      placeholder="Full Name"
                      onChange={(event) => {
                        setDisplayedRow((prevDisplayRow) =>                         
                        prevDisplayRow.map((row) =>(
                        row.id === e.id ? { ...row, Name: event.target.value } : row) 
                      )
                      )
                     
                        if (autosave === 0) {
                          handleCellChange(e.id, "Name", event.target.value);
                        }
                      }}
                    />
                  </th>
                  <td className="px-6 py-4 w-[40%]">
                    <input
                      className="appearance-none bg-transparent border-none text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                      type="date"
                      value={(autosave === 0 ? e.Date : displayedRow[index]?.Date)|| ''}
                      placeholder="Date"
                      aria-label="Date"
                      onChange={(event) => {
                        setDisplayedRow((prevDisplayRow) =>                         
                        prevDisplayRow.map((row) =>(
                        row.id === e.id && { ...row, Date: event.target.value })
                      )
                      )
                        if (autosave === 0) {
                          handleCellChange(e.id, "Date", event.target.value);
                        }
                      }}
                      // onChange={(event) => {
                      //   setRow(
                      //     [...row],
                      //     (row.filter((id) => id.id === e.id)[0].Date =
                      //       event.target.value)
                      //   );
                      // }}
                    />
                  </td>
                  <td className="px-6 py-4 w-[20%]">
                    <select
                      id="underline_select"
                      className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                      value={(autosave === 0 ? e["Appointment Library"] : displayedRow[index] && displayedRow[index]["Appointment Library"]) || ''}
                      onChange={(event) => {
                        setDisplayedRow((prevDisplayRow) =>                         
                        prevDisplayRow.map((row) =>(
                        row.id === e.id && { ...row, "Appointment Library": event.target.value })
                      )
                      )
                        if (autosave === 0) {
                          handleCellChange(e.id, "Appointment Library", event.target.value);
                        }
                      }}
                      // onChange={(event) => {
                      //   setRow(
                      //     [...row],
                      //     (row.filter((id) => id.id === e.id)[0][
                      //       "Appointment Library"
                      //     ] = event.target.value)
                      //   );
                      // }}
                    >
                      <option value="" disabled>
                        Choose a Library
                      </option>
                      <option value="0">OXVC TEST123</option>
                      <option value="1">OXVC TEST</option>
                      <option value="2">OXVC TEST</option>
                      <option value="3">OXVC TEST</option>
                    </select>
                  </td>
                </tr>
                {/* first condition */}
                {expandedRows.includes(index) && (
                  <tr className="">
                    <td colSpan={3} className="">
                      <div className="flex justify-center">
                        <div className="w-[90%]">
                          <div className="border-b-2 mb-1  px-2 mb-4">
                            <div className="font-bold flex gap-[5px] text-[15px]">
                              Appointment -
                              <div className="font-normal">
                                Total Records {e?.ApointmentData?.length || "0"}
                              </div>
                              <div className="flex gap-[5px] text-[15px] px-2">
                                |{" "}
                                <div
                                  onClick={() => {
                                   addAppointmentData(index);
                                  }}
                                >
                                  <AddIcon />
                                </div>{" "}
                                <div
                                onClick={() => {
                                RemoveAppointmentData(index);
                              }}>
                                <CloseSVG />
                                </div>
                                <FunnelSVG /> <RefreshIcon />
                                <div className="bg-sky-800 text-white">
                                  Auto Save On
                                </div>
                              </div>
                            </div>
                          </div>
                          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                              <tr>
                                <th scope="col" className=" flex px-6 py-3">
                                  <input
                                    className="mr-2"
                                    type="checkbox"
                                    onChange={() =>
                                      handleInsideCheckboxChange(-1, index)
                                    }
                                    checked={insideselectedRows.includes(-1)}
                                  />
                                  Subject
                                </th>
                                <th scope="col" className="px-6 py-3">
                                  Created On
                                </th>
                                <th scope="col" className="px-6 py-3">
                                  Doctor
                                </th>
                                <th scope="col" className="px-6 py-3">
                                  Start Time
                                </th>
                                <th scope="col" className="px-6 py-3">
                                  End Time
                                </th>
                                <th scope="col" className="px-6 py-3">
                                  Decription
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {e?.ApointmentData?.map((Data, key) => (
                                <tr
                                  key={key}
                                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                >
                                  <th
                                    scope="row"
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                  >
                                    <input
                                      type="checkbox"
                                      onChange={() =>
                                        handleInsideCheckboxChange(Data.id)
                                      }
                                      checked={insideselectedRows.includes(
                                        Data.id
                                      )}
                                    />
                                    <input
                                      className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                                      type="text"
                                      value={Data.Subject}
                                      placeholder="Subject"
                                      aria-label="Subject"
                                      onChange={(event) => {
                                        setRow(
                                          [...row],
                                          (row
                                            .filter((id) => id.id === e.id)[0]
                                            .ApointmentData.filter(
                                              (id) => id.id === Data.id
                                            )[0].Subject = event.target.value)
                                        );
                                      }}
                                    />
                                  </th>
                                  <td className="px-6 py-4">
                                    <input
                                      className="appearance-none bg-transparent border-none w-25  text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                                      type="date"
                                      value={Data["Created On"]}
                                      placeholder="CreatedOn"
                                      aria-label="CreatedOn"
                                      onChange={(event) => {
                                        setRow(
                                          [...row],
                                          (row
                                            .filter((id) => id.id === e.id)[0]
                                            .ApointmentData.filter(
                                              (id) => id.id === Data.id
                                            )[0]["Created On"] =
                                            event.target.value)
                                        );
                                      }}
                                    />
                                  </td>
                                  <td className="px-6 py-4">
                                    {/* <input
                                      className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                                      type="text"
                                      value={e.Doctor}
                                      placeholder="Doctor"
                                      aria-label="Doctor"
                                      onChange={(event)=>{ setRow([...row],row.filter((id)=>(id.id === e.id))[0].ApointmentData.filter((id)=>(id.id === e.id))[0].Doctor = event.target.value);}}
                                    /> */}
                                    <select
                                      className="block py-2.5 px-0 w-fit text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                                      value={Data.Doctor}
                                      onChange={(event) => {
                                        setRow(
                                          [...row],
                                          (row
                                            .filter((id) => id.id === e.id)[0]
                                            .ApointmentData.filter(
                                              (id) => id.id === Data.id
                                            )[0]["Created On"] =
                                            event.target.value)
                                        );
                                      }}
                                    >
                                      <option value="" disabled>
                                        Choose a Doctor
                                      </option>
                                      <option value="0">Doctor 1</option>
                                      <option value="1">Doctor 2</option>
                                      <option value="2">Doctor 3</option>
                                      <option value="3">Doctor 4</option>
                                    </select>
                                  </td>
                                  <td className="px-6 py-4">
                                    <input
                                      className="appearance-none bg-transparent border-none w-25 text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                                      type="time"
                                      value={Data["Start Time"]}
                                      placeholder="StartTime"
                                      aria-label="StartTime"
                                      onChange={(event) => {
                                        setRow(
                                          [...row],
                                          (row
                                            .filter((id) => id.id === e.id)[0]
                                            .ApointmentData.filter(
                                              (id) => id.id === Data.id
                                            )[0]["Start Time"] =
                                            event.target.value)
                                        );
                                      }}
                                    />
                                  </td>
                                  <td className="px-6 py-4">
                                    <input
                                      className="appearance-none bg-transparent border-none w-25  text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                                      type="time"
                                      value={Data["End Time"]}
                                      placeholder="EndTime"
                                      aria-label="EndTime"
                                      onChange={(event) => {
                                        setRow(
                                          [...row],
                                          (row
                                            .filter((id) => id.id === e.id)[0]
                                            .ApointmentData.filter(
                                              (id) => id.id === Data.id
                                            )[0]["End Time"] =
                                            event.target.value)
                                        );
                                      }}
                                    />
                                  </td>
                                  <td className="px-6 py-4">
                                    <input
                                      className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                                      type="text"
                                      value={Data.Decription}
                                      placeholder="Description"
                                      aria-label="Description"
                                      onChange={(event) => {
                                        setRow(
                                          [...row],
                                          (row
                                            .filter((id) => id.id === e.id)[0]
                                            .ApointmentData.filter(
                                              (id) => id.id === Data.id
                                            )[0].Decription =
                                            event.target.value)
                                        );
                                      }}
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
    </div>
  );
}

export default App;

