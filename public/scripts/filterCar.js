// Class Car
class Car {
    constructor(cars) {
        this.cars = cars;
    }
    filterCarAvailable() {
        return this.cars.filter(car => car.available === true);
    }
    filterCarByUser() {
        var driver = document.getElementById("driver").value;
        var date = document.getElementById('date').value;
        var time = document.getElementById('time').value;
        var dateTime = date + time;
        var passanger = document.getElementById('passanger').value;

        if (driver === undefined) {
            alert("Please select a driver");
            return;
        } else if (dateTime < getDateTimeNow()) {
            alert("Please select a date and time greater than now");
            return;
        } else if (passanger == "") {
            return this.cars.filter(car => car.available === true && car.availableAt <= dateTime);
        } else {
            return this.cars.filter(car => car.available === true && car.capacity >= passanger && car.availableAt <= dateTime);
        }
    }
}

// Module Request
var xmlHttp = new XMLHttpRequest();
xmlHttp.open("GET", "http://localhost:8000/api/cars", false);
xmlHttp.send(null); // Request body null

// Get Data from JSON
var data = JSON.parse(xmlHttp.responseText);

// Filter Car by Available
var cars = new Car(data);

// Get Element by ID carsList
var app = document.getElementById('carsList');
htmlData = "";

// Get Data from API
var data = cars.filterCarAvailable();

// Function Format Rupiah
function rupiah(number) {
    return new Intl.NumberFormat("id-ID", {style: "currency",currency: "IDR"}).format(number);
}

// Trigger Function by Button id=btnFilterCar
var btnFilterCar = document.getElementById('btnFilterCar').addEventListener('click', getCars);

// Function Number Format Rupiah
function getDateTimeNow() {
    var today = new Date();
    var date = today.getFullYear()+'-'+String((today.getMonth()+1)).padStart(2, '0')+'-'+String(today.getDate()).padStart(2, '0');
    var time = String(today.getHours()).padStart(2, '0') + ":" + String(today.getMinutes()).padStart(2, '0') + ":" + String(today.getSeconds()).padStart(2, '0');
    var dateNow = date+'T'+time+'.000Z';
    return dateNow;
}

// Loop Data
function getCars() {
    var htmlData = "";
    data = cars.filterCarByUser();
    if (data === undefined) {
        alert("Car Not Found");
    } else {
        for (let index = 0; index < data.length; index++) {
            var car = data[index];
            var rentCost = rupiah(car.rentPerDay);
            htmlData += `
            <div class="col-auto m-2 mx-auto">
                <div class="card" style="width: 18rem; height: 550px">
                <img src="${car.image}"" class="card-img-top " alt="${car.manufacture}" style="height: 190px; object-fit: scale-down;">
                <div class="card-body" style="font-size: 14px;">
                    <p class="card-title">${car.manufacture} ${car.model}</p>
                    <p class="fw-bold">${rentCost} / hari</p>
                    <p class="card-text" style="height: 90px">${car.description}</p>
                    <div class="my-2"><i class="bi bi-people me-2"></i>${car.capacity} Orang</div>
                    <div class="my-2"><i class="bi bi-gear me-2"></i>${car.transmission}</div>
                    <div class="my-2"><i class="bi bi-calendar4 me-2"></i>${car.year}</div>
                    <a href="#" class="btn bg_button text-white w-100 mt-2 fw-bold mt-4" style="font-size: 14px;">Pilih Mobil</a>
                </div>
                </div>
            </div>
            `;
        }
        app.innerHTML = htmlData;
    }
}