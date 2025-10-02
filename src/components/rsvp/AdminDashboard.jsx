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
import { db } from "./firebaseConfig"; // Firebase config
import { useNavigate } from "react-router-dom";
import "@ant-design/v5-patch-for-react-19";

const { Option } = Select;
const { Title, Text } = Typography;

const AdminDashboard = () => {
  const [rsvpEntries, setRsvpEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [showModal, setShowModal] = useState(true);

  const navigate = useNavigate();
  const adminPassword = "Maria25";

  useEffect(() => {
    if (authenticated) {
      fetchRsvps();
      setShowModal(false);
    }
  }, [authenticated]);

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
      querySnapshot.forEach((doc) => {
        entries.push({ id: doc.id, ...doc.data() });
      });
      setRsvpEntries(entries);
      setFilteredEntries(entries);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching RSVP entries:", error);
      setLoading(false);
    }
  };

  const handleFilterChange = (value) => {
    setFilterStatus(value);
    if (value === "all") {
      setFilteredEntries(rsvpEntries);
    } else {
      setFilteredEntries(rsvpEntries.filter((r) => r.attending === value));
    }
  };

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

  const exportToExcel = () => {
    const worksheetData = filteredEntries.map((entry) => ({
      ID: entry.id,
      Attendance: entry.attending === "yes" ? "SI" : "NO",
      Name: entry.name || "",
      Allergies: entry.allergies || "",
      Transfer: entry.transfer || "",
      Message: entry.message || "",
      Timestamp: entry.createdAt?.toDate?.().toLocaleString() || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "RSVPs");

    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    saveAs(blob, "rsvp_entries.xlsx");
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
    { title: "Message", dataIndex: "message", key: "message" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  // Counts
  const countYes = rsvpEntries.filter((r) => r.attending === "yes").length;
  const countNo = rsvpEntries.filter((r) => r.attending === "no").length;
  const countTotal = rsvpEntries.length;

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
    <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
        Admin Dashboard - RSVP Entries
      </Title>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card
            bordered={false}
            style={{
              backgroundColor: "#52c41a",
              color: "#fff",
              textAlign: "center",
            }}
          >
            <Title level={4} style={{ color: "#fff" }}>
              Attendees
            </Title>
            <Text style={{ fontSize: 24, fontWeight: "bold", color: "#fff" }}>
              {countYes}
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card
            bordered={false}
            style={{
              backgroundColor: "#f5222d",
              color: "#fff",
              textAlign: "center",
            }}
          >
            <Title level={4} style={{ color: "#fff" }}>
              Non-Attendees
            </Title>
            <Text style={{ fontSize: 24, fontWeight: "bold", color: "#fff" }}>
              {countNo}
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card
            bordered={false}
            style={{
              backgroundColor: "#1890ff",
              color: "#fff",
              textAlign: "center",
            }}
          >
            <Title level={4} style={{ color: "#fff" }}>
              Total RSVPs
            </Title>
            <Text style={{ fontSize: 24, fontWeight: "bold", color: "#fff" }}>
              {countTotal}
            </Text>
          </Card>
        </Col>
      </Row>

      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <Select
          value={filterStatus}
          onChange={handleFilterChange}
          style={{ width: 150 }}
        >
          <Option value="all">All</Option>
          <Option value="yes">SI</Option>
          <Option value="no">NO</Option>
        </Select>

        <Button
          icon={<DownloadOutlined />}
          onClick={exportToExcel}
          disabled={filteredEntries.length === 0}
        >
          Download Excel
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredEntries}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default AdminDashboard;
