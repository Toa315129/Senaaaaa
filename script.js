const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const strip = document.getElementById("strip");
const ctx = canvas.getContext("2d");
const stripCtx = strip.getContext("2d");

const startBtn = document.getElementById("start");
const retakeBtn = document.getElementById("retake");
const downloadBtn = document.getElementById("download");
const countdownEl = document.getElementById("countdown");
const loading = document.getElementById("loading");
const app = document.getElementById("app");
const result = document.getElementById("result");

let photos = [];
const TOTAL = 4;

/* CAMERA */
navigator.mediaDevices.getUserMedia({ video: true })
.then(stream => {
  video.srcObject = stream;
  loading.classList.add("hidden");
  app.classList.remove("hidden");
})
.catch(() => {
  alert("ไม่สามารถเปิดกล้องได้");
});

/* COUNTDOWN */
function countdown(sec) {
  return new Promise(resolve => {
    countdownEl.classList.remove("hidden");
    let i = sec;
    countdownEl.textContent = i;
    const timer = setInterval(() => {
      i--;
      if (i === 0) {
        clearInterval(timer);
        countdownEl.classList.add("hidden");
        resolve();
      } else {
        countdownEl.textContent = i;
      }
    }, 1000);
  });
}

/* TAKE PHOTO */
function takePhoto() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0);
  photos.push(canvas.toDataURL("image/png"));
}

/* START */
startBtn.onclick = async () => {
  photos = [];
  for (let i = 0; i < TOTAL; i++) {
    await countdown(3);
    takePhoto();
  }
  buildStrip();
};

/* BUILD STRIP */
function buildStrip() {
  const img = new Image();
  img.onload = () => {
    strip.width = img.width;
    strip.height = img.height * photos.length;
    photos.forEach((src, i) => {
      const im = new Image();
      im.src = src;
      im.onload = () => {
        stripCtx.drawImage(im, 0, i * im.height);
      };
    });
  };
  img.src = photos[0];

  result.classList.remove("hidden");
  startBtn.classList.add("hidden");
  retakeBtn.classList.remove("hidden");
  downloadBtn.classList.remove("hidden");
}

/* RETAKE */
retakeBtn.onclick = () => {
  photos = [];
  stripCtx.clearRect(0,0,strip.width,strip.height);
  result.classList.add("hidden");
  startBtn.classList.remove("hidden");
  retakeBtn.classList.add("hidden");
  downloadBtn.classList.add("hidden");
};

/* DOWNLOAD */
downloadBtn.onclick = () => {
  const a = document.createElement("a");
  a.href = strip.toDataURL("image/png");
  a.download = "senaphotobooth.png";
  a.click();
};
