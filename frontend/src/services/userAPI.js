import axios from "axios";

const userAPI = async (inputs) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/users",
      inputs
    );

    console.log("Response from server:", response.data); // Kiểm tra phản hồi từ server
    return response.data; // Trả về dữ liệu nếu cần sử dụng
  } catch (err) {
    console.error("Axios error:", err);
    throw err; // Ném lỗi để xử lý bên ngoài nếu cần
  }
};

export default userAPI;
