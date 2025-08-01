import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import floor0Data from "./nodes_connections_floor0.json";
import floor1Data from "./nodes_connections_floor1.json";
import floor2Data from "./nodes_connections_floor2.json";
import floor3Data from "./nodes_connections_floor3.json";

const Destination = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const [startNode, setStartNode] = useState("");
  const [selectedEndNode, setSelectedEndNode] = useState("");
  const [floor0Nodes, setFloor0Nodes] = useState([]);
  const [floor1Nodes, setFloor1Nodes] = useState([]);
  const [floor2Nodes, setFloor2Nodes] = useState([]);
  const [floor3Nodes, setFloor3Nodes] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [openFloor, setOpenFloor] = useState(null); // 'floor0' or 'floor1' or 'floor2

  // Hidden nodes for each floor
  const hiddenNodes_floor0 = new Set(["Hallway1", "Hallway2", "parent_s1", "parent_ss1", "unkown_floor0_1", "parent_s2", "unkown_floor0_2",
    "Hallway3", "Hallway4", "Hallway5", "Hallway6", "Hallway7", "parent_s3", "unkown_floor0_3",
    "Hallway8", "parent_s4", "Hallway9", "parent_s5", "parent_ss5",""]);
  const hiddenNodes_floor1 = new Set(["inter1", "inter2", "inter3", "inter4", "inter5", "inter6", "inter7", "inter8", "inter9", "inter10", "inter11", "inter12", "inter13", "inter14", "inter15", "inter16", "inter17", "inter18", "inter19", "inter20", "inter21", "inter22", "inter23", "inter24", "inter25", "inter26", "inter27", "inter28", "inter29", "inter30", "inter31", "inter32", "inter33", "inter34", "inter35", "inter36", "inter37", "inter38", ""]);
  const hiddenNodes_floor2 = new Set(["i1", "i2", "i3", "i4", "i5", "i6", "i7", "i8", "i9", "i10",
    "i11", "i13", "i14", "i15", "i16", "i17", "i18", "i20", "i21", "i22",
    "i23", "i24", "i25", "i26", "i27", "i28", "i29", "i30", "i31", "i32",
    "i33", "i34", "i35", "i36", "i37", "i38", "i39", "i40", "i41", "i42", "i43", "i44", "i46", "i47", "i48",
    "Unkown1", "Unkown2", "Unkown3", "Unkown4", "Unkown5", "Unkown6", "Unkown7", "Unkown8", "Unkown9", "Unkown10", "Unkown12", "Unkown13", "Unkown14",
    "Unkown15", "Unkown16", "Unkown17", "Unkown18", "Unkown19", "Unkown21", "Unkown22", "Unkown24", "Unkown25", "Unkown26", "Unkown27", "Unkown28",
    "Unkown29", "Unkown30", "Unkown31",""]);
  const hiddenNodes_floor3 = new Set(["int1", "int2", "int3", "int4", "int5", "int6", "int7", "int8", "int9", "int10",
    "int11", "int12", "int13", "int14", "int15", "int16", "int17", "int18", "int19", "int20",
    "int21", "int22", "int23", "int24", "int25", "int26", "in27", "int28", "unkown1_RezDeJardin", "unkown2_RezDeJardin",""]);

  // Maps for case-insensitive key lookup
  const floor0LowerMap = {};
  for (const key of Object.keys(floor0Data.nodes)) {
    floor0LowerMap[key.toLowerCase()] = key;
  }
  const floor1LowerMap = {};
  for (const key of Object.keys(floor1Data.nodes)) {
    floor1LowerMap[key.toLowerCase()] = key;
  }
  const floor2LowerMap = {};
  for (const key of Object.keys(floor2Data.nodes)) {
    floor2LowerMap[key.toLowerCase()] = key;
  }
  const floor3LowerMap = {};
  for (const key of Object.keys(floor3Data.nodes)) {
    floor3LowerMap[key.toLowerCase()] = key;
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const start = params.get("start");
    setStartNode(start || "");
    setSelectedEndNode(""); // reset selected destination on start change

    const floor0Keys = Object.keys(floor0Data.nodes || {});
    const floor1Keys = Object.keys(floor1Data.nodes || {});
    const floor2Keys = Object.keys(floor2Data.nodes || {});
    const floor3Keys = Object.keys(floor3Data.nodes || {});

    const isStartInFloor0 = floor0Keys.includes(start);
    const isStartInFloor1 = floor1Keys.includes(start);
    const isStartInFloor2 = floor2Keys.includes(start);
    const isStartInFloor3 = floor3Keys.includes(start);

    // Filter out startNode and hidden nodes for floor0
    const filteredFloor0 = (isStartInFloor0
      ? floor0Keys.filter((k) => k !== start)
      : floor0Keys
    ).filter((node) => !hiddenNodes_floor0.has(node));

    // Filter out startNode and hidden nodes for floor1
    const filteredFloor1 = (isStartInFloor1
      ? floor1Keys.filter((k) => k !== start)
      : floor1Keys
    ).filter((node) => !hiddenNodes_floor1.has(node));

    const filteredFloor2 = (isStartInFloor2
      ? floor2Keys.filter((k) => k !== start)
      : floor2Keys
    ).filter((node) => !hiddenNodes_floor2.has(node));

    const filteredFloor3 = (isStartInFloor3
      ? floor3Keys.filter((k) => k !== start)
      : floor3Keys
    ).filter((node) => !hiddenNodes_floor3.has(node));

    setFloor0Nodes(filteredFloor0);
    setFloor1Nodes(filteredFloor1);
    setFloor2Nodes(filteredFloor2);
    setFloor3Nodes(filteredFloor3);
  }, [location.search]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
        setOpenFloor(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNodeSelect = (node) => {
    setSelectedEndNode(node);
    setDropdownOpen(false);
    setOpenFloor(null);
  };

  const handleFindPath = () => {
    if (!startNode || !selectedEndNode) {
      alert("Please select both start and destination nodes.");
      return;
    }

    const normalizedStart = startNode.trim().toLowerCase();
    const normalizedEnd = selectedEndNode.trim().toLowerCase();

    const startInFloor0Key = floor0LowerMap[normalizedStart];
    const startInFloor1Key = floor1LowerMap[normalizedStart];
    const startInFloor2Key = floor2LowerMap[normalizedStart];
    const startInFloor3Key = floor3LowerMap[normalizedStart];
    const endInFloor0Key = floor0LowerMap[normalizedEnd];
    const endInFloor1Key = floor1LowerMap[normalizedEnd];
    const endInFloor2Key = floor2LowerMap[normalizedEnd];
    const endInFloor3Key = floor3LowerMap[normalizedEnd];

    const isStartInFloor0 = Boolean(startInFloor0Key);
    const isStartInFloor1 = Boolean(startInFloor1Key);
    const isStartInFloor2 = Boolean(startInFloor2Key);
    const isStartInFloor3 = Boolean(startInFloor3Key);
    const isEndInFloor0 = Boolean(endInFloor0Key);
    const isEndInFloor1 = Boolean(endInFloor1Key);
    const isEndInFloor2 = Boolean(endInFloor2Key);
    const isEndInFloor3 = Boolean(endInFloor3Key);

    // ✅ Same floor navigation
    if (
      (isStartInFloor0 && isEndInFloor0) ||
      (isStartInFloor1 && isEndInFloor1) ||
      (isStartInFloor2 && isEndInFloor2) ||
      (isStartInFloor3 && isEndInFloor3)
    ) {
      const floorPath = isStartInFloor0
        ? "/floor"
        : isStartInFloor1
          ? "/floor1"
          : isStartInFloor2
            ? "/floor2"
            : "/floor3";

      navigate(
        `${floorPath}?start=${encodeURIComponent(
          startInFloor0Key || startInFloor1Key || startInFloor2Key || startInFloor3Key
        )}&end=${encodeURIComponent(
          endInFloor0Key || endInFloor1Key || endInFloor2Key || endInFloor3Key
        )}`
      );
      return;
    }

    // floor0 → floor1
    if (isStartInFloor0 && isEndInFloor1) {
      navigate(
        `/floor?start=${encodeURIComponent(startInFloor0Key)}&end=${encodeURIComponent("Escalier1 1er & 2éme étage")}` +
        `&continueTo=/floor1?start=${encodeURIComponent("Entrée 1er étage_0")}&finalEnd=${encodeURIComponent(endInFloor1Key)}`
      );
      return;
    }

    // floor1 → floor0
    if (isStartInFloor1 && isEndInFloor0) {
      navigate(
        `/floor1?start=${encodeURIComponent(startInFloor1Key)}&end=${encodeURIComponent("Entrée 1er étage_0")}` +
        `&continueTo=/floor?start=${encodeURIComponent("Escalier1 1er & 2éme étage")}&finalEnd=${encodeURIComponent(endInFloor0Key)}`
      );
      return;
    }

    // floor2 → floor1
    if (isStartInFloor2 && isEndInFloor1) {
      navigate(
        `/floor2?start=${encodeURIComponent(startInFloor2Key)}&end=${encodeURIComponent("Escalier1 1er etage, Rez de chausse")}` +
        `&continueTo=/floor1?start=${encodeURIComponent("Entrée 1er étage_0")}&finalEnd=${encodeURIComponent(endInFloor1Key)}`
      );
      return;
    }

    // floor1 → floor2
    if (isStartInFloor1 && isEndInFloor2) {
      navigate(
        `/floor1?start=${encodeURIComponent(startInFloor1Key)}&end=${encodeURIComponent("Entrée 1er étage_0")}` +
        `&continueTo=/floor2?start=${encodeURIComponent("Escalier1 1er etage, Rez de chausse")}&finalEnd=${encodeURIComponent(endInFloor2Key)}`
      );
      return;
    }

    // floor0 → floor2
    if (isStartInFloor0 && isEndInFloor2) {
      navigate(
        `/floor?start=${encodeURIComponent(startInFloor0Key)}&end=${encodeURIComponent("Escalier1 1er & 2éme étage")}` +
        `&continueTo=/floor2?start=${encodeURIComponent("Escalier1 1er etage, Rez de chausse")}&finalEnd=${encodeURIComponent(endInFloor2Key)}`
      );
      return;
    }

    // floor2 → floor0
    if (isStartInFloor2 && isEndInFloor0) {
      navigate(
        `/floor2?start=${encodeURIComponent(startInFloor2Key)}&end=${encodeURIComponent("Escalier1 1er etage, Rez de chausse")}` +
        `&continueTo=/floor?start=${encodeURIComponent("Escalier1 1er & 2éme étage")}&finalEnd=${encodeURIComponent(endInFloor0Key)}`
      );
      return;
    }

    // ✅ NEW: floor3 → floor1
    if (isStartInFloor3 && isEndInFloor1) {
      navigate(
        `/floor3?start=${encodeURIComponent(startInFloor3Key)}&end=${encodeURIComponent("Escalier_RezDeJardin_1")}` +
        `&continueTo=/floor1?start=${encodeURIComponent("Entrée 1er étage_0")}&finalEnd=${encodeURIComponent(endInFloor1Key)}`
      );
      return;
    }

    // ✅ NEW: floor1 → floor3
    if (isStartInFloor1 && isEndInFloor3) {
      navigate(
        `/floor1?start=${encodeURIComponent(startInFloor1Key)}&end=${encodeURIComponent("Entrée 1er étage_0")}` +
        `&continueTo=/floor3?start=${encodeURIComponent("Escalier_RezDeJardin_1")}&finalEnd=${encodeURIComponent(endInFloor3Key)}`
      );
      return;
    }

    // ✅ NEW: floor3 → floor0
    if (isStartInFloor3 && isEndInFloor0) {
      navigate(
        `/floor3?start=${encodeURIComponent(startInFloor3Key)}&end=${encodeURIComponent("Escalier_RezDeJardin_1")}` +
        `&continueTo=/floor?start=${encodeURIComponent("Escalier rez de jardin")}&finalEnd=${encodeURIComponent(endInFloor0Key)}`
      );
      return;
    }

    // ✅ NEW: floor0 → floor3
    if (isStartInFloor0 && isEndInFloor3) {
      navigate(
        `/floor?start=${encodeURIComponent(startInFloor0Key)}&end=${encodeURIComponent("Escalier rez de jardin")}` +
        `&continueTo=/floor3?start=${encodeURIComponent("Escalier_RezDeJardin_1")}&finalEnd=${encodeURIComponent(endInFloor3Key)}`
      );
      return;
    }

    // ✅ NEW: floor3 → floor2
    if (isStartInFloor3 && isEndInFloor2) {
      navigate(
        `/floor3?start=${encodeURIComponent(startInFloor3Key)}&end=${encodeURIComponent("Escalier_RezDeJardin_1")}` +
        `&continueTo=/floor2?start=${encodeURIComponent("Escalier1 1er etage, Rez de chausse")}&finalEnd=${encodeURIComponent(endInFloor2Key)}`
      );
      return;
    }

    // ✅ NEW: floor2 → floor3
    if (isStartInFloor2 && isEndInFloor3) {
      navigate(
        `/floor2?start=${encodeURIComponent(startInFloor2Key)}&end=${encodeURIComponent("Escalier1 1er etage, Rez de chausse")}` +
        `&continueTo=/floor3?start=${encodeURIComponent("Escalier_RezDeJardin_1")}&finalEnd=${encodeURIComponent(endInFloor3Key)}`
      );
      return;
    }

    // ❌ Invalid combination
    alert("Invalid start or end nodes selected.");
    console.log("Start Node (normalized):", normalizedStart);
    console.log("End Node (normalized):", normalizedEnd);
    console.log("Mapped start floor0 key:", startInFloor0Key);
    console.log("Mapped start floor1 key:", startInFloor1Key);
    console.log("Mapped start floor2 key:", startInFloor2Key);
    console.log("Mapped start floor3 key:", startInFloor3Key);
    console.log("Mapped end floor0 key:", endInFloor0Key);
    console.log("Mapped end floor1 key:", endInFloor1Key);
    console.log("Mapped end floor2 key:", endInFloor2Key);
    console.log("Mapped end floor3 key:", endInFloor3Key);
  };

  // UI return section is omitted as requested

return (
  <div style={styles.container}>
    <h1 style={styles.title}>🧭 Choose Your Destination</h1>

    <div style={styles.fieldGroup}>
      <label style={styles.label}>Start Node:</label>
      <input
        type="text"
        value={startNode}
        readOnly
        style={{ ...styles.input, backgroundColor: "#eee", fontWeight: "bold" }}
      />
    </div>

    <div style={styles.fieldGroup} ref={dropdownRef}>
      <label style={styles.label}>Destination Node:</label>
      <div style={styles.dropdownWrapper} onClick={() => setDropdownOpen(!dropdownOpen)}>
        <div style={styles.dropdownHeader}>{selectedEndNode || "Select Destination"}</div>

        {dropdownOpen && (
          <div style={styles.dropdownMenu}>
            {/* Floor 0 */}
            <div
              style={styles.floorToggle}
              onClick={(e) => {
                e.stopPropagation();
                setOpenFloor(openFloor === "floor0" ? null : "floor0");
              }}
            >
              🏢 rez de chaussée {openFloor === "floor0" ? "▲" : "▼"}
            </div>
            {openFloor === "floor0" &&
              floor0Nodes.map((node) => (
                <div
                  key={node}
                  style={styles.nodeItem}
                  onClick={() => handleNodeSelect(node)}
                >
                  {node}
                </div>
              ))}

            {/* Floor 1 */}
            <div
              style={styles.floorToggle}
              onClick={(e) => {
                e.stopPropagation();
                setOpenFloor(openFloor === "floor1" ? null : "floor1");
              }}
            >
              🏢 1ér étage {openFloor === "floor1" ? "▲" : "▼"}
            </div>
            {openFloor === "floor1" &&
              floor1Nodes.map((node) => (
                <div
                  key={node}
                  style={styles.nodeItem}
                  onClick={() => handleNodeSelect(node)}
                >
                  {node}
                </div>
              ))}

            {/* Floor 2 */}
            <div
              style={styles.floorToggle}
              onClick={(e) => {
                e.stopPropagation();
                setOpenFloor(openFloor === "floor2" ? null : "floor2");
              }}
            >
              🏢 2éme étage {openFloor === "floor2" ? "▲" : "▼"}
            </div>
            {openFloor === "floor2" &&
              floor2Nodes.map((node) => (
                <div
                  key={node}
                  style={styles.nodeItem}
                  onClick={() => handleNodeSelect(node)}
                >
                  {node}
                </div>
              ))}
            {/* Floor 3 */}
            <div
              style={styles.floorToggle}
              onClick={(e) => {
                e.stopPropagation();
                setOpenFloor(openFloor === "floor3" ? null : "floor3");
              }}
            >
              🏢 Rez de jardin {openFloor === "floor3" ? "▲" : "▼"}
            </div>
            {openFloor === "floor3" &&
              floor3Nodes.map((node) => (
                <div
                  key={node}
                  style={styles.nodeItem}
                  onClick={() => handleNodeSelect(node)}
                >
                  {node}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>

    <button style={styles.findButton} onClick={handleFindPath}>
      🚀 Find Path
    </button>
  </div>
);

};

export default Destination;

// ---------- STYLES ----------
const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    maxWidth: "600px",
    margin: "50px auto",
    padding: "30px",
    backgroundColor: "#fff",
    borderRadius: "16px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
  },
  title: {
    marginBottom: "30px",
    fontSize: "28px",
    fontWeight: "bold",
    textAlign: "center",
    color: "#1e272e",
  },
  fieldGroup: {
    marginBottom: "30px",
  },
  label: {
    display: "block",
    marginBottom: "10px",
    fontWeight: "600",
    fontSize: "16px",
    color: "#34495e",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  dropdownWrapper: {
    position: "relative",
    userSelect: "none",
  },
  dropdownHeader: {
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#f4f4f4",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "500",
  },
  dropdownMenu: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    zIndex: 999,
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
    marginTop: "6px",
    padding: "10px 0",
    maxHeight: "300px",
    overflowY: "auto",
  },
  floorToggle: {
    padding: "12px 18px",
    fontWeight: "600",
    cursor: "pointer",
    backgroundColor: "#eaeaea",
    borderBottom: "1px solid #ddd",
    fontSize: "15px",
  },
  nodeItem: {
    padding: "10px 24px",
    cursor: "pointer",
    fontSize: "15px",
    transition: "background 0.2s",
    color: "#2d3436",
  },
  findButton: {
    width: "100%",
    padding: "14px",
    fontSize: "18px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background-color 0.3s ease",
  },
};