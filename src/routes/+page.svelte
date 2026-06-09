<script>
    import { onMount } from 'svelte';

    let isMobileMenuOpen = $state(false);

    function toggleMobileMenu() {
        isMobileMenuOpen = !isMobileMenuOpen;
    }

    onMount(() => {
        // ===== THEME TOGGLE =====
        const html = document.documentElement;
        const toggle = document.getElementById('theme-toggle');
        const icon = toggle.querySelector('i');
        const STORAGE_KEY = 'ansor-theme';

        if (toggle && icon) {
            // Restore saved theme
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved === 'dark') {
                html.setAttribute('data-theme', 'dark');
                icon.classList.replace('fa-moon', 'fa-sun');
            }

            toggle.addEventListener('click', function () {
                const isDark = html.getAttribute('data-theme') === 'dark';
                if (isDark) {
                    html.removeAttribute('data-theme');
                    icon.classList.replace('fa-sun', 'fa-moon');
                    localStorage.setItem(STORAGE_KEY, 'light');
                } else {
                    html.setAttribute('data-theme', 'dark');
                    icon.classList.replace('fa-moon', 'fa-sun');
                    localStorage.setItem(STORAGE_KEY, 'dark');
                }
            });
        }

        // ===== Navbar scroll effect =====
        window.addEventListener('scroll', function () {
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }
        });

        // ===== Smooth scrolling =====
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // ===== Form submission =====
        const form = document.querySelector('.contact-form form');
        if (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                alert('Terima kasih! Pesan Anda telah terkirim. Kami akan segera menghubungi Anda.');
                this.reset();
            });
        }
    });
</script>

<svelte:head>
    <title>PC GP Ansor Kota Madiun - Gerakan Pemuda Ansor</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="/main-style.css">
</svelte:head>

<!-- NAVBAR -->
<nav class="navbar">
    <div class="nav-container">
        <div class="logo-section">
            <img src="https://upload.wikimedia.org/wikipedia/id/thumb/7/70/Logo_GP_Ansor.png/250px-Logo_GP_Ansor.png"
                alt="Logo GP Ansor" class="logo">
            <div class="logo-text">
                <h2>GP Ansor</h2>
                <p>Kota Madiun</p>
            </div>
        </div>
        <ul class="nav-menu {isMobileMenuOpen ? 'active' : ''}">
            <li><a href="#home" onclick={() => isMobileMenuOpen = false}>Beranda</a></li>
            <li><a href="#tentang" onclick={() => isMobileMenuOpen = false}>Tentang</a></li>
            <li><a href="#program" onclick={() => isMobileMenuOpen = false}>Program</a></li>
            <li><a href="#visi-misi" onclick={() => isMobileMenuOpen = false}>Visi & Misi</a></li>
            <li><a href="/pdf-tools" onclick={() => isMobileMenuOpen = false}>PDF Tools</a></li>
            <li><a href="#kontak" onclick={() => isMobileMenuOpen = false}>Kontak</a></li>
        </ul>
        <div style="display: flex; align-items: center;">
            <button id="theme-toggle" class="theme-toggle" aria-label="Toggle dark/light mode">
                <i class="fas fa-moon"></i>
            </button>
            <button class="mobile-toggle" onclick={toggleMobileMenu} aria-label="Toggle mobile menu">
                <i class="fas {isMobileMenuOpen ? 'fa-times' : 'fa-bars'}"></i>
            </button>
        </div>
    </div>
</nav>

<!-- HERO SECTION -->
<section class="hero" id="home">
    <div class="hero-content">
        <div class="hero-logo">
            <img src="https://upload.wikimedia.org/wikipedia/id/thumb/7/70/Logo_GP_Ansor.png/250px-Logo_GP_Ansor.png"
                alt="Logo GP Ansor">
        </div>
        <h1>Gerakan Pemuda Ansor<br>Kota Madiun</h1>
        <p>Organisasi kepemudaan Nahdlatul Ulama yang berkomitmen membangun generasi muda berakhlak, berwawasan, dan
            berkontribusi untuk bangsa</p>
        <div class="cta-buttons">
            <a href="#program" class="btn btn-primary">Lihat Program</a>
            <a href="#kontak" class="btn btn-secondary">Hubungi Kami</a>
        </div>
    </div>
</section>

<!-- ABOUT SECTION -->
<section class="about" id="tentang">
    <div class="about-container">
        <div class="about-image">
            <img src="/assets/image/ansorkotamadiun.jpeg" alt="GP Ansor Activity">
        </div>
        <div class="about-content">
            <h2>Tentang GP Ansor</h2>
            <p>Gerakan Pemuda Ansor (GP Ansor) adalah organisasi kepemudaan Nahdlatul Ulama yang didirikan pada 24
                April 1934. GP Ansor Kota Madiun merupakan representasi organisasi di tingkat kota yang aktif
                mengembangkan potensi pemuda.</p>
            <p>Kami berkomitmen untuk membentuk generasi muda yang berakhlakul karimah, berwawasan luas, terampil,
                dan mampu berkontribusi positif bagi masyarakat, bangsa, dan negara.</p>
            <p>Dengan berbagai program kaderisasi, pelatihan, dan kegiatan sosial kemasyarakatan, GP Ansor Kota
                Madiun terus berinovasi dalam memberdayakan pemuda.</p>

            <div class="stats">
                <div class="stat-item">
                    <h3>12+</h3>
                    <p>Program Kerja</p>
                </div>
                <div class="stat-item">
                    <h3>500+</h3>
                    <p>Anggota Aktif</p>
                </div>
                <div class="stat-item">
                    <h3>90+</h3>
                    <p>Tahun Berdiri</p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- PROGRAMS SECTION -->
<section class="programs" id="program">
    <div class="section-header">
        <h2>Program Kerja Kami</h2>
        <p>Berbagai program yang dirancang untuk pengembangan kualitas anggota dan kontribusi kepada masyarakat</p>
    </div>
    <div class="programs-grid">
        <div class="program-card">
            <div class="program-icon"><img src="/assets/image/Banser merah.png" alt="Banser"></div>
            <h3>Banser</h3>
            <p>Satuan pengamanan yang siap menjaga keamanan dan ketertiban dalam berbagai kegiatan keagamaan dan
                masyarakat.</p>
        </div>
        <div class="program-card">
            <div class="program-icon"><img src="/assets/image/Rijalul Ansor.png" alt="MDSRA"></div>
            <h3>Keagamaan</h3>
            <p>Peringatan Hari Besar Islam (PHBI) dengan kegiatan sholawatan, pengajian, dan tahlil untuk memperkuat
                spiritualitas.</p>
        </div>
        <div class="program-card">
            <div class="program-icon">💻</div>
            <h3>Digital & Teknologi</h3>
            <p>Pelatihan IT dan penggunaan AI untuk meningkatkan kompetensi digital anggota sesuai perkembangan
                zaman.</p>
        </div>
        <div class="program-card">
            <div class="program-icon">📚</div>
            <h3>Kaderisasi</h3>
            <p>Program pembinaan dan pengembangan kader melalui Diklat Terpadu PKD, Diklatsar, dan Dirosah Ula untuk
                mencetak pemimpin masa depan.</p>
        </div>
        <div class="program-card">
            <div class="program-icon">🤝</div>
            <h3>Kolaborasi</h3>
            <p>Kerjasama dengan berbagai banom NU dan lembaga eksternal untuk memperluas jaringan dan dampak
                positif.</p>
        </div>
        <div class="program-card">
            <div class="program-icon">🎯</div>
            <h3>Upgrading Internal</h3>
            <p>Program peningkatan soft skill dan launching tagline "Ansor Intelegent" untuk optimasi organisasi
                modern.</p>
        </div>
    </div>
    <!-- single button to detail page -->
    <div style="text-align:center; margin-top:28px;">
        <a href="/e/detailProker" class="btn btn-primary" aria-label="Lihat Detail Program">Lihat Detail Program</a>
    </div>
</section>

<!-- VISI MISI SECTION -->
<section class="vision" id="visi-misi">
    <div class="vision-container">
        <div class="vision-header">
            <h2>Visi & Misi</h2>
        </div>
        <div class="vision-grid">
            <div class="vision-box">
                <h3>Visi</h3>
                <p>Mewujudkan Gerakan Pemuda Ansor yang progresif, mandiri, berdaya, modern, berintegritas dalam
                    membentuk generasi muda yang berakhlakul karimah serta berkontribusi aktif dalam kemandirian
                    ekonomi, kemajuan umat, bangsa, dan negara.</p>
            </div>
            <div class="vision-box">
                <h3>Misi</h3>
                <ul>
                    <li>Meningkatkan Kualitas dan Kuantitas Kaderisasi</li>
                    <li>Meningkatkan Softskill dan Hardskill Anggota</li>
                    <li>Membentuk tim Siber yang kompeten</li>
                    <li>Membangun kolaborasi strategis dengan berbagai pihak</li>
                    <li>Meningkatkan rutinan Majelis Sholawat</li>
                    <li>Membangun kemandirian ekonomi organisasi</li>
                </ul>
            </div>
        </div>
    </div>
</section>

<!-- CONTACT SECTION -->
<section class="contact" id="kontak">
    <div class="contact-container">
        <div class="contact-info">
            <h2>Hubungi Kami</h2>
            <p>Ada pertanyaan atau ingin bergabung dengan GP Ansor Kota Madiun? Jangan ragu untuk menghubungi kami
                melalui kontak di bawah ini.</p>

            <div class="contact-details">
                <div class="contact-item">
                    <div class="contact-icon">📍</div>
                    <div class="contact-text">
                        <h4>Alamat</h4>
                        <p>Jl. Bawonomanis No.1, Perumnas Manisrejo, Kota Madiun, Jawa Timur, Indonesia</p>
                    </div>
                </div>
                <div class="contact-item">
                    <div class="contact-icon">📧</div>
                    <div class="contact-text">
                        <h4>Email</h4>
                        <p>admin@ansorkotamadiun.or.id</p>
                    </div>
                </div>
                <div class="contact-item">
                    <div class="contact-icon">📱</div>
                    <div class="contact-text">
                        <h4>Telepon</h4>
                        <p>+62 xxx-xxxx-xxxx</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="contact-form">
            <form>
                <div class="form-group">
                    <label for="name">Nama Lengkap</label>
                    <input type="text" id="name" name="name" placeholder="Masukkan nama lengkap">
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="nama@email.com">
                </div>
                <div class="form-group">
                    <label for="phone">Nomor Telepon</label>
                    <input type="tel" id="phone" name="phone" placeholder="+62 xxx-xxxx-xxxx">
                </div>
                <div class="form-group">
                    <label for="message">Pesan</label>
                    <textarea id="message" name="message" placeholder="Tuliskan pesan Anda di sini..."></textarea>
                </div>
                <button type="submit" class="btn-submit">Kirim Pesan</button>
            </form>
        </div>
    </div>
</section>

<!-- FOOTER -->
<footer class="footer">
    <div class="footer-container">
        <div class="footer-section">
            <h3>GP Ansor Kota Madiun</h3>
            <p>Organisasi kepemudaan Nahdlatul Ulama yang berkomitmen membentuk generasi muda berakhlak dan
                berwawasan.</p>
            <div class="social-links">
                <a href="https://www.instagram.com" class="social-link" title="Instagram" target="_blank">
                    <i class="fab fa-instagram"></i>
                </a>
                <a href="mailto:gpansor.madiun@gmail.com" class="social-link" title="Email">
                    <i class="fas fa-envelope"></i>
                </a>
                <a href="https://twitter.com" class="social-link" title="Twitter" target="_blank">
                    <i class="fab fa-twitter"></i>
                </a>
            </div>
        </div>
        <div class="footer-section">
            <h3>Menu</h3>
            <a href="#home">Beranda</a>
            <a href="#tentang">Tentang Kami</a>
            <a href="#program">Program</a>
            <a href="#visi-misi">Visi & Misi</a>
        </div>
        <div class="footer-section">
            <h3>Bidang-bidang</h3>
            <a href="#program">Kaderisasi</a>
            <a href="#program">Banser</a>
            <a href="#program">Cyber</a>
            <a href="#program">Keagamaan</a>
        </div>
        <div class="footer-section">
            <h3>Kontak</h3>
            <p>Kota Madiun, Jawa Timur</p>
            <p>gpansor.madiun@gmail.com</p>
            <p>+62 xxx-xxxx-xxxx</p>
        </div>
    </div>
    <div class="footer-bottom">
        <p>&copy; 2025 GP Ansor Kota Madiun. All rights reserved.</p>
    </div>
</footer>

<style>
    .mobile-toggle {
        display: none;
        background: none;
        border: none;
        font-size: 24px;
        color: var(--text-primary);
        cursor: pointer;
        margin-left: 20px;
        padding: 5px;
        transition: transform 0.3s ease;
    }

    @media (max-width: 768px) {
        .mobile-toggle {
            display: block;
        }
        
        .nav-menu {
            display: flex !important;
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: var(--bg-navbar);
            flex-direction: column;
            padding: 0;
            box-shadow: var(--shadow-navbar);
            gap: 20px;
            text-align: center;
            
            /* Animation CSS */
            max-height: 0;
            opacity: 0;
            visibility: hidden;
            overflow: hidden;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            transform: translateY(-10px);
        }

        .nav-menu.active {
            max-height: 400px;
            opacity: 1;
            visibility: visible;
            padding: 20px 0;
            transform: translateY(0);
        }
    }
</style>
