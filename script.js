// DUMBBELL GYM — تفاعلات الموقع
// مهم: استبدل الرقم التالي برقم واتساب الجيم مع كود الدولة، من غير + أو مسافات.
// مثال مصر: 2010XXXXXXX
const WHATSAPP_NUMBER = "201027135212";

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("menu-open", isOpen);
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

function whatsappUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function configureWhatsApp() {
  const defaultMessage = "مرحبًا DUMBBELL GYM، أريد الاستفسار عن الاشتراكات.";
  document.getElementById("whatsappLink").href = whatsappUrl(defaultMessage);
  document.getElementById("floatingWhatsapp").href = whatsappUrl(defaultMessage);
}
configureWhatsApp();

// اختيار باقة من كروت الأسعار ينقل الاختيار إلى نموذج التسجيل.
document.querySelectorAll(".choose-plan").forEach((button) => {
  button.addEventListener("click", () => {
    const plan = button.dataset.plan;
    document.getElementById("plan").value = plan;
  });
});

// نموذج واجهة فقط: يتحقق من البيانات ثم يفتح واتساب برسالة جاهزة.
// لا يتم حفظ البيانات في قاعدة بيانات؛ يلزم Backend إذا أردت تسجيلًا فعليًا.
const joinForm = document.getElementById("joinForm");
const formMessage = document.getElementById("formMessage");

joinForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formMessage.classList.remove("error");

  const fullName = document.getElementById("fullName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const plan = document.getElementById("plan").value;
  const goal = document.getElementById("goal").value;

  const normalizedPhone = phone.replace(/[\s\-()]/g, "");
  if (fullName.length < 2) {
    formMessage.textContent = "من فضلك اكتب الاسم بشكل صحيح.";
    formMessage.classList.add("error");
    return;
  }
  if (!/^\+?[0-9]{8,15}$/.test(normalizedPhone)) {
    formMessage.textContent = "من فضلك راجع رقم الموبايل واكتبه بالأرقام فقط.";
    formMessage.classList.add("error");
    return;
  }
  if (!plan || !goal) {
    formMessage.textContent = "من فضلك اختار الباقة والهدف من التمرين.";
    formMessage.classList.add("error");
    return;
  }

  const message = [
    "طلب اشتراك جديد - DUMBBELL GYM",
    `الاسم: ${fullName}`,
    `رقم الموبايل: ${normalizedPhone}`,
    `الباقة: ${plan}`,
    `الهدف: ${goal}`
  ].join("\n");

  formMessage.textContent = "بياناتك جاهزة. هيفتح واتساب لإرسال الطلب؛ اضغط إرسال داخل واتساب لتأكيده.";
  window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
});

// تأثير ظهور الأقسام عند التمرير.
const revealTargets = document.querySelectorAll(
  ".about-copy, .about-image, .program-card, .trainer-card, .price-card, .join-copy, .join-form, .section-heading"
);
revealTargets.forEach((element) => element.classList.add("reveal"));

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealTargets.forEach((element) => observer.observe(element));
} else {
  revealTargets.forEach((element) => element.classList.add("visible"));
}

// يوضح الرابط النشط في القائمة حسب القسم الظاهر.
const sections = document.querySelectorAll("main section[id]");
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.querySelectorAll("a").forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  sections.forEach((section) => sectionObserver.observe(section));
}
