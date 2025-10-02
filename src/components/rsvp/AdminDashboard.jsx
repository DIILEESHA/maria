import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Select,
  Modal,
  Input,
  Card,
  Row,
  Col,
  Typography,
} from "antd";
import { DeleteOutlined, DownloadOutlined } from "@ant-design/icons";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { db } from "./firebaseConfig";
import { useNavigate } from "react-router-dom";
import "@ant-design/v5-patch-for-react-19";

const { Option } = Select;
const { Title, Text } = Typography;

const AdminDashboard = () => {
  const [rsvpEntries, setRsvpEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [childrenFilter, setChildrenFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [childrenModalVisible, setChildrenModalVisible] = useState(false);
  const [currentChildren, setCurrentChildren] = useState([]);

  const navigate = useNavigate();
  const adminPassword = "Maria25";

  useEffect(() => {
    if (authenticated) {
      fetchRsvps();
      setShowModal(false);
    }
  }, [authenticated]);

  useEffect(() => {
    let entries = [...rsvpEntries];

    if (filterStatus !== "all") {
      entries = entries.filter((r) => r.attending === filterStatus);
    }

    if (childrenFilter !== "all") {
      if (childrenFilter === "yes") {
        entries = entries.filter((r) => {
          const childrenArr = getChildrenArray(r);
          const bringingFlag = r.bringingChildren === "yes";
          return bringingFlag || (Array.isArray(childrenArr) && childrenArr.length > 0);
        });
      } else if (childrenFilter === "no") {
        entries = entries.filter((r) => {
          const childrenArr = getChildrenArray(r);
          const bringingFlag = r.bringingChildren === "yes";
          return !bringingFlag && (!Array.isArray(childrenArr) || childrenArr.length === 0);
        });
      }
    }

    setFilteredEntries(entries);
  }, [rsvpEntries, filterStatus, childrenFilter]);

  const checkPassword = () => {
    if (password === adminPassword) {
      setAuthenticated(true);
    } else {
      Modal.error({
        title: "Authentication Failed",
        content: "Incorrect password. Please try again.",
      });
      setPassword("");
    }
  };

  const fetchRsvps = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "rsvpResponses"));
      const entries = [];
      querySnapshot.forEach((docSnap) => {
        entries.push({ id: docSnap.id, ...docSnap.data() });
      });
      setRsvpEntries(entries);
      setFilteredEntries(entries);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching RSVP entries:", error);
      setLoading(false);
    }
  };

  const handleFilterChange = (value) => setFilterStatus(value);
  const handleChildrenFilterChange = (value) => setChildrenFilter(value);

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Are you sure to delete this RSVP entry?",
      onOk: async () => {
        try {
          await deleteDoc(doc(db, "rsvpResponses", id));
          fetchRsvps();
        } catch (error) {
          console.error("Error deleting RSVP entry:", error);
        }
      },
    });
  };

  const getChildrenArray = (entry) => {
    if (!entry) return [];
    if (Array.isArray(entry.children)) return entry.children;
    if (entry.childrenAges && typeof entry.childrenAges === "string") {
      const ages = entry.childrenAges.split(",").map((s) => s.trim()).filter(Boolean);
      return ages.map((a, idx) => ({ name: `Child ${idx + 1}`, age: a }));
    }
    return [];
  };

  const formatTimestamp = (createdAt) => {
    try {
      if (!createdAt) return "";
      if (typeof createdAt?.toDate === "function") {
        return createdAt.toDate().toLocaleString();
      }
      const d = createdAt instanceof Date ? createdAt : new Date(createdAt);
      return isNaN(d.getTime()) ? "" : d.toLocaleString();
    } catch {
      return "";
    }
  };

  const exportToExcel = () => {
    const worksheetData = filteredEntries.map((entry) => {
      const childrenArr = getChildrenArray(entry);
      const childrenDetails = childrenArr.length
        ? childrenArr.map((c) => `${(c.name || "").trim()} (${c.age ?? ""})`).join(", ")
        : "";
      return {
        ID: entry.id,
        Attendance: entry.attending === "yes" ? "SI" : "NO",
        Name: entry.name || "",
        Allergies: entry.allergies || "",
        Transfer: entry.transfer || "",
        BringingChildren: (entry.bringingChildren === "yes" || childrenArr.length > 0) ? "SI" : "NO",
        ChildrenCount: childrenArr.length,
        ChildrenDetails: childrenDetails,
        Message: entry.message || "",
        Timestamp: formatTimestamp(entry.createdAt),
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "RSVPs");
    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    saveAs(blob, "rsvp_entries.xlsx");
  };

  const showFullChildrenModal = (childrenArr) => {
    setCurrentChildren(childrenArr);
    setChildrenModalVisible(true);
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Attendance",
      dataIndex: "attending",
      key: "attending",
      filters: [
        { text: "SI", value: "yes" },
        { text: "NO", value: "no" },
      ],
      onFilter: (value, record) => record.attending === value,
      render: (text) => (text === "yes" ? "SI" : "NO"),
    },
    { title: "Allergies", dataIndex: "allergies", key: "allergies" },
    { title: "Transfer", dataIndex: "transfer", key: "transfer" },
    {
      title: "Bringing Children",
      dataIndex: "bringingChildren",
      key: "bringingChildren",
      render: (_, record) => {
        const childrenArr = getChildrenArray(record);
        return record.bringingChildren === "yes" || childrenArr.length > 0 ? "SI" : "NO";
      },
    },
    {
      title: "Children Count",
      dataIndex: "childrenCount",
      key: "childrenCount",
      render: (_, record) => getChildrenArray(record).length || 0,
    },
    {
      title: "Children Details",
      dataIndex: "childrenDetails",
      key: "childrenDetails",
      render: (_, record) => {
        const childrenArr = getChildrenArray(record);
        if (!childrenArr.length) return <Text type="secondary">—</Text>;

        if (childrenArr.length <= 2) {
          const formatted = childrenArr.map((c) => `${(c.name || "").trim()} (${c.age ?? ""})`).join(", ");
          return <span>{formatted}</span>;
        } else {
          const firstTwo = childrenArr.slice(0, 2).map((c) => `${(c.name || "").trim()} (${c.age ?? ""})`).join(", ");
          return (
            <span>
              {firstTwo}{" "}
              <Button type="link" onClick={() => showFullChildrenModal(childrenArr)} style={{ padding: 0 }}>
                View Full Details
              </Button>
            </span>
          );
        }
      },
    },
    { title: "Message", dataIndex: "message", key: "message" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>
          Delete
        </Button>
      ),
    },
  ];

  // Counts
  const countYes = rsvpEntries.filter((r) => r.attending === "yes").length;
  const countNo = rsvpEntries.filter((r) => r.attending === "no").length;
  const countTotal = rsvpEntries.length;
  const countBringingChildren = rsvpEntries.filter((r) => {
    const childrenArr = getChildrenArray(r);
    return r.bringingChildren === "yes" || childrenArr.length > 0;
  }).length;
  const totalChildren = rsvpEntries.reduce((sum, r) => {
    const childrenArr = getChildrenArray(r);
    return sum + (childrenArr.length || 0);
  }, 0);

  if (!authenticated) {
    return (
      <Modal
        title="Admin Access Required"
        open={showModal}
        onCancel={() => navigate("/")}
        footer={[
          <Button key="cancel" onClick={() => navigate("/")}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={checkPassword}>
            Submit
          </Button>,
        ]}
        closable={false}
        maskClosable={false}
      >
        <Input.Password
          placeholder="Enter admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onPressEnter={checkPassword}
          autoFocus
        />
      </Modal>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 1400, margin: "0 auto" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
        Admin Dashboard - RSVP Entries
      </Title>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card bordered={false} style={{ backgroundColor: "#52c41a", color: "#fff", textAlign: "center",marginBottom:"20px" }}>
            <Title level={4} style={{ color: "#fff" }}>Attendees</Title>
            <Text style={{ fontSize: 24, fontWeight: "bold", color: "#fff" }}>{countYes}</Text>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card bordered={false} style={{ backgroundColor: "#f5222d", color: "#fff", textAlign: "center",marginBottom:"20px"  }}>
            <Title level={4} style={{ color: "#fff" }}>Non-Attendees</Title>
            <Text style={{ fontSize: 24, fontWeight: "bold", color: "#fff" }}>{countNo}</Text>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card bordered={false} style={{ backgroundColor: "#1890ff", color: "#fff", textAlign: "center" ,marginBottom:"20px" }}>
            <Title level={4} style={{ color: "#fff" }}>Total RSVPs</Title>
            <Text style={{ fontSize: 24, fontWeight: "bold", color: "#fff" }}>{countTotal}</Text>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card bordered={false} style={{ backgroundColor: "#ffa940", color: "#fff", textAlign: "center" ,marginBottom:"20px" }}>
            <Title level={4} style={{ color: "#fff" }}>Guests with Children</Title>
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}>{countBringingChildren}</Text>
            <div><Text style={{ color: "#fff", fontSize: 12 }}>Children total: {totalChildren}</Text></div>
          </Card>
        </Col>
      </Row>

      <div
        style={{
          marginBottom: 16,
          display: "flex",
          gap: 12,
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Select value={filterStatus} onChange={handleFilterChange} style={{ width: 150 }}>
            <Option value="all">All</Option>
            <Option value="yes">SI</Option>
            <Option value="no">NO</Option>
          </Select>

          <Select value={childrenFilter} onChange={handleChildrenFilterChange} style={{ width: 200 }}>
            <Option value="all">All children filter</Option>
            <Option value="yes">Bringing children - SI</Option>
            <Option value="no">Bringing children - NO</Option>
          </Select>
        </div>

        <Button icon={<DownloadOutlined />} onClick={exportToExcel} disabled={filteredEntries.length === 0}>
          Download Excel
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredEntries}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1400 }}
      />

      <Modal
        title="Children Details"
        open={childrenModalVisible}
        footer={<Button onClick={() => setChildrenModalVisible(false)}>Close</Button>}
        onCancel={() => setChildrenModalVisible(false)}
      >
        {currentChildren.map((c, i) => (
          <div key={i}>
            {c.name || `Child ${i + 1}`} {c.age !== undefined && `• ${c.age} anni`}
          </div>
        ))}
      </Modal>
    </div>
  );
};

export default AdminDashboard;
