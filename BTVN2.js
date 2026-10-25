// ==================== DỮ LIỆU BAN ĐẦU ====================
let passengers = [
    {
        pnrCode: "AB12CD",
        passengerName: "Nguyen Van An",
        idNumber: "001092012345", // CCCD 12 số hợp lệ
        flightNumber: "VN201",
        seatNumber: "12A",
        isCheckedIn: true
    },
    {
        pnrCode: "EF34GH",
        passengerName: "Tran Thi Binh",
        idNumber: "B1234567",     // Hộ chiếu hợp lệ (1 chữ cái + 7-8 số)
        flightNumber: "VN305",
        seatNumber: "",
        isCheckedIn: false
    }
];

// Danh sách ghế mẫu trong hệ thống cho từng chuyến bay
const availableSeats = ["12A", "12B", "12C", "14A", "14B", "14C", "15A", "15B"];

// ==================== HÀM TIỆN ÍCH & NGHIỆP VỤ ====================

// 1. Xác thực số định danh (CCCD hoặc Hộ chiếu)
const validateIdNumber = (idNumber) => {
    if (typeof idNumber !== "string") return false;
    const cleanId = idNumber.trim();
    
    // CCCD: Đúng 12 chữ số | Hộ chiếu: 1 chữ cái in hoa/thường + 7 đến 8 chữ số
    const cccdRegex = /^\d{12}$/;
    const passportRegex = /^[A-Za-z][0-9]{7,8}$/;
    
    return cccdRegex.test(cleanId) || passportRegex.test(cleanId);
};

// 2. Tìm hồ sơ hành khách theo mã PNR
const findPassengerByPnr = (list, pnr) => {
    if (!pnr) return null;
    const target = pnr.trim().toUpperCase();
    for (let i = 0; i < list.length; i++) {
        if (list[i].pnrCode === target) {
            return list[i];
        }
    }
    return null;
};

// 3. Kiểm tra ghế đã bị trùng trên cùng chuyến bay chưa
const isSeatTaken = (list, flightNumber, seat) => {
    return list.some(p => p.flightNumber === flightNumber && p.seatNumber === seat && p.isCheckedIn);
};

// 4. Tự động cấp một ghế trống cho chuyến bay
const assignAutomaticSeat = (list, flightNumber) => {
    for (let i = 0; i < availableSeats.length; i++) {
        let seat = availableSeats[i];
        if (!isSeatTaken(list, flightNumber, seat)) {
            return seat;
        }
    }
    return null; // Hết ghế
};

// 5. Xuất thẻ Boarding Pass chuẩn quốc tế (đóng khung dấu =)
const displayBoardingPass = (passenger) => {
    console.log("==================================================");
    console.log("                 BOARDING PASS                    ");
    console.log("==================================================");
    console.log(` Mã PNR     : ${passenger.pnrCode}`);
    console.log(` Hành khách : ${passenger.passengerName}`);
    console.log(` Số giấy tờ : ${passenger.idNumber}`);
    console.log(` Chuyến bay : ${passenger.flightNumber}`);
    console.log(` Số ghế     : ${passenger.seatNumber}`);
    console.log("--------------------------------------------------");
    console.log(" [|||| ||| |||||| ||||] Mã vạch giả lập an ninh");
    console.log("==================================================");
};

// 6. Tiếp nhận hồ sơ hành khách mới
const handleCreateProfile = (list) => {
    let pnr = prompt("Nhập mã PNR (ví dụ: XY12AB):");
    if (!pnr) { console.log("Đã hủy thao tác."); return; }
    pnr = pnr.trim().toUpperCase();

    if (findPassengerByPnr(list, pnr)) {
        console.log("Lỗi: Mã PNR đã tồn tại trong hệ thống!");
        return;
    }

    let name = prompt("Nhập tên hành khách:");
    if (!name || name.trim() === "") { console.log("Tên không được để trống."); return; }

    let idNum = prompt("Nhập số CCCD (12 số) hoặc Hộ chiếu (1 chữ cái + 7-8 số):");
    if (!validateIdNumber(idNum)) {
        console.log("Lỗi: Số định danh (CCCD/Hộ chiếu) không hợp lệ!");
        return;
    }

    let flight = prompt("Nhập số hiệu chuyến bay (ví dụ: VN201):");
    if (!flight || flight.trim() === "") { console.log("Chuyến bay không hợp lệ."); return; }

    const newPassenger = {
        pnrCode: pnr,
        passengerName: name.trim(),
        idNumber: idNum.trim(),
        flightNumber: flight.trim().toUpperCase(),
        seatNumber: "",
        isCheckedIn: false
    };

    list.push(newPassenger);
    console.log("Thêm hồ sơ hành khách thành công!");
};

// 7. Thực hiện Check-in, kiểm chuẩn & cấp ghế
const handleCheckIn = (list) => {
    let pnr = prompt("Nhập mã PNR cần làm thủ tục check-in:");
    if (!pnr) { console.log("Đã hủy thao tác."); return; }

    let passenger = findPassengerByPnr(list, pnr);
    if (!passenger) {
        console.log("Không tìm thấy hồ sơ hành khách với mã PNR này.");
        return;
    }

    if (passenger.isCheckedIn) {
        console.log("Hành khách này đã hoàn tất check-in trước đó rồi!");
        displayBoardingPass(passenger);
        return;
    }

    // Kiểm chuẩn lại giấy tờ tùy thân trước khi cho phép check-in
    let idCheck = prompt(`Xác nhận số CCCD/Hộ chiếu cho hành khách ${passenger.passengerName}:`);
    if (!idCheck || idCheck.trim() !== passenger.idNumber) {
        console.log("Lỗi bảo mật: Số giấy tờ không khớp. Từ chối check-in!");
        return;
    }

    // Cấp số ghế tự động
    let assignedSeat = assignAutomaticSeat(list, passenger.flightNumber);
    if (!assignedSeat) {
        console.log("Rất tiếc, chuyến bay đã hết ghế trống!");
        return;
    }

    // Cập nhật trạng thái
    passenger.seatNumber = assignedSeat;
    passenger.isCheckedIn = true;

    console.log("Check-in thành công!");
    displayBoardingPass(passenger);
};

// 8. Hiển thị danh sách hồ sơ hành khách dạng bảng
const listPassengers = (list) => {
    console.log("===== DANH SÁCH HỒ SƠ HÀNH KHÁCH =====");
    if (list.length === 0) {
        console.log("Chưa có hồ sơ nào.");
        return;
    }
    console.table(
        list.map(p => ({
            "Mã PNR": p.pnrCode,
            "Hành khách": p.passengerName,
            "Số giấy tờ": p.idNumber,
            "Chuyến bay": p.flightNumber,
            "Ghế": p.seatNumber ? p.seatNumber : "Chưa có",
            "Trạng thái Check-in": p.isCheckedIn ? "ĐÃ CHECK-IN" : "CHƯA CHECK-IN"
        }))
    );
};

// ==================== HÀM ĐIỀU PHỐI CHÍNH (MAIN MENU) ====================
const main = () => {
    let menuChoice;

    do {
        const choice = prompt(
            "===== QUẢN LÝ HỒ SƠ & CHECK-IN SÂN BAY =====\n" +
            "1. Xem danh sách hồ sơ hành khách\n" +
            "2. Thêm hồ sơ hành khách mới\n" +
            "3. Thực hiện Check-in & Cấp ghế\n" +
            "4. Thoát hệ thống\n" +
            "Nhập lựa chọn (1-4):"
        );

        menuChoice = choice === null ? "4" : choice.trim();

        switch (menuChoice) {
            case "1":
                listPassengers(passengers);
                break;

            case "2":
                handleCreateProfile(passengers);
                break;

            case "3":
                handleCheckIn(passengers);
                break;

            case "4":
                console.log("Đã thoát hệ thống kiểm soát an ninh sân bay.");
                break;

            default:
                console.log("Lựa chọn không hợp lệ. Vui lòng nhập từ 1 đến 4.");
        }
    } while (menuChoice !== "4");
};