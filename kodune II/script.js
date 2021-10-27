"use strict";
// muutujad

let andmed;
let rippMenu;
let joonis;
let jooniseAndmed = [];
let aastaSelect = document.getElementById("aasta");
let suguSelect = document.getElementById("sugu");
let liikSelect = document.getElementById("liik");
const nupp = document.querySelector(".submit");
// failist andmed ja nende korrastamine.
/*
    \a - alert
    \b - backspace
    \n - negative
    \r - return
    \t - tab
    etc
*/

fetch("haridus.txt")
  .then((yhendus) => yhendus.text())
  .then((sisu) => {
    andmed = sisu.split("\n").map((rida) => rida.split(/[\t\s\r]+/));
    andmed.splice(1, 1);
    andmed.pop();
    for (let i = 1; i < andmed.length; i++) {
      andmed[i].pop();
      if (andmed[i].length >= 7) {
        let t1 = andmed[i].splice(0, 2);
        let t2 = andmed[i].pop();
        let t3 = andmed[i].join().replaceAll(",", " ");
        t1.push(t3, t2);
        andmed[i] = t1;
      }
      andmed[i][3] = parseInt(andmed[i][3]);
    }
    let t1 = andmed[0].splice(0, 2);
    let t2 = andmed[0].join().replaceAll(",", " ").split(":");
    t1.push(t2[0], t2[1]);
    andmed[0] = t1;
    console.log(andmed);
    // rippmenüüd

    ripp(aastaSelect, 0);
    ripp(suguSelect, 1);
    ripp(liikSelect, 2);
    document.getElementById("field1").textContent = andmed[0][0];
    document.getElementById("field2").textContent = andmed[0][1];
    document.getElementById("field3").textContent = andmed[0][2];
    joonisekiht();
  });

function hariduskokku(aasta, sugu, liik) {
  let kokku = 0;
  for (let i = 1; i < andmed.length; i++) {
    if (aasta === andmed[i][0] && !sugu && !liik) {
      kokku += andmed[i][3];
    }
    if (aasta === andmed[i][0] && sugu === andmed[i][1] && !liik) {
      kokku += andmed[i][3];
    }
    if (aasta === andmed[i][0] && !sugu && liik === andmed[i][2]) {
      kokku += andmed[i][3];
    }
    if (
      aasta === andmed[i][0] &&
      sugu === andmed[i][1] &&
      liik === andmed[i][2]
    ) {
      kokku += andmed[i][3];
    }
    if (sugu === andmed[i][1] && !aasta && !liik) {
      kokku += andmed[i][3];
    }
    if (sugu === andmed[i][1] && !aasta && liik === andmed[i][2]) {
      kokku += andmed[i][3];
    }
    if (liik === andmed[i][2] && !aasta && !sugu) {
      kokku += andmed[i][3];
    }
    if (liik === andmed[i][2] && !aasta && sugu === andmed[i][1]) {
      kokku += andmed[i][3];
    }
    if (!aasta && !sugu && !liik) {
      kokku += andmed[i][3];
    }
  }
  return kokku;
}

function unikaalsed(value) {
  let temp = [];
  for (let i = 1; i < andmed.length; i++) {
    temp.push(andmed[i][value]);
  }
  return temp;
}

function ripp(element, unikaalsusId) {
  rippMenu = [...new Set(unikaalsed(unikaalsusId))];
  for (let i = 0; i < rippMenu.length; i++) {
    element.add(new Option(rippMenu[i]));
  }
  return;
}
function joonisekiht() {
  let temp = hariduskokku();
  jooniseAndmed.push(temp);
  joonis = new Chart(document.getElementById("joonis"), {
    type: "bar",
    data: {
      labels: ["Kokku"],
      datasets: [
        {
          label: andmed[0][3],
          data: jooniseAndmed,
          backgroundColor: "blue",
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
        xAxes: [
          {
            barPercentage: 0.3,
          },
        ],
      },
    },
  });
}

nupp.addEventListener("click", function () {
  jooniseAndmed = [];
  joonis.data.datasets[0].data.pop();
  joonis.data.datasets[0].data.push(
    hariduskokku(aastaSelect.value, suguSelect.value, liikSelect.value)
  );
  joonis.update();
  console.log(joonis.data.datasets[0].data);
});
