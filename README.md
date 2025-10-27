# PASC Region J Conference 2026 Website

**Lead Beyond Limits - February 13, 2026**

A custom-built conference website with a full-featured Content Management System (CMS) for managing announcements and conference information.

![ColdFusion](https://img.shields.io/badge/ColdFusion-2021-blue)
![SQL Server](https://img.shields.io/badge/SQL%20Server-2019-red)
![License](https://img.shields.io/badge/license-MIT-green)

## 🚀 Project Overview

This is a professional conference website built for the Pennsylvania Association of Student Councils (PASC) Region J 2026 Leadership Conference. The site features a custom admin panel for managing dynamic content, announcements, and conference information.

**Live Site:** [pascregionj.com](https://pascregionj.com)

## ✨ Features

### Public Website
- **Responsive Design** - Mobile-friendly layout that works on all devices
- **Dynamic Announcements** - Homepage displays active announcements managed through admin panel
- **Featured Content** - Highlight important announcements with featured badges
- **Date-Based Publishing** - Schedule announcements to appear/disappear automatically
- **Conference Information** - About, Gallery, Workshops, Registration, Contact, and Resources pages
- **SSL Security** - Full HTTPS encryption

### Admin Panel
- **Secure Authentication** - Password-protected admin access
- **Announcement Management**
  - Create, Read, Update, Delete (CRUD) operations
  - Rich text content editing
  - Toggle active/inactive status
  - Featured announcement marking
  - Custom display ordering (drag-to-reorder)
  - Publish date scheduling with start/end dates
- **Smart Ordering System**
  - New announcements automatically appear at top
  - Automatic gap-closing when deleting items
  - Manual reordering via dropdown selection
- **Status Indicators**
  - Live/Inactive/Future status badges
  - Visual date validation
  - Featured announcement highlighting

## 🛠️ Technology Stack

**Backend:**
- ColdFusion 2021
- Microsoft SQL Server 2019
- T-SQL for database operations

**Frontend:**
- HTML5 / CSS3
- Vanilla JavaScript
- Responsive CSS Grid & Flexbox
- Custom CSS animations

**Hosting:**
- DailyRazor ColdFusion Hosting
- SSL/TLS encryption (Let's Encrypt)

## 📁 Project Structure

```
pascregionj/
├── admin/                          # Admin panel
│   ├── announcements/              # Announcement management
│   │   ├── index.cfm              # List all announcements
│   │   ├── add.cfm                # Create new announcement
│   │   ├── edit.cfm               # Edit existing announcement
│   │   └── delete.cfm             # Delete announcement
│   ├── login.cfm                  # Admin authentication
│   ├── dashboard.cfm              # Admin dashboard
│   └── logout.cfm                 # Session cleanup
├── includes/                       # Shared templates
│   ├── header.cfm                 # Site header & navigation
│   ├── footer.cfm                 # Site footer
│   ├── auth_check.cfm             # Authentication verification
│   └── db_config.cfm              # Database configuration
├── assets/                         # Static resources
│   ├── css/                       # Stylesheets
│   │   ├── style.css              # Main site styles
│   │   ├── admin-dashboard.css    # Admin panel styles
│   │   └── mobile-menu.css        # Mobile navigation
│   ├── js/                        # JavaScript files
│   │   └── main.js                # Site functionality
│   └── img/                       # Images & logos
├── index.cfm                      # Homepage
├── about.cfm                      # About page
├── gallery.cfm                    # Photo gallery
├── workshops.cfm                  # Workshop information
├── contact.cfm                    # Contact form
├── resources.cfm                  # Resources page
├── Application.cfc                # ColdFusion application settings
└── database/
    └── schema.sql                 # Database schema & setup

```

## 🗄️ Database Schema

**announcements** table:
```sql
- id (INT, PRIMARY KEY, IDENTITY)
- title (NVARCHAR(500))
- content (NVARCHAR(MAX))
- is_active (BIT)
- is_featured (BIT)
- display_order (INT)
- publish_start (DATE)
- publish_end (DATE, NULL)
- created_by (INT)
- created_at (DATETIME)
- updated_at (DATETIME)
```

**admin_users** table:
```sql
- id (INT, PRIMARY KEY, IDENTITY)
- username (NVARCHAR(100))
- password_hash (NVARCHAR(255))
- email (NVARCHAR(255))
- full_name (NVARCHAR(255))
- is_active (BIT)
- created_at (DATETIME)
- last_login (DATETIME)
```

## 🚀 Installation & Setup

### Prerequisites
- ColdFusion 2021+ (or Lucee 5.3+)
- Microsoft SQL Server 2019+ (or Azure SQL Database)
- Web server (IIS or Apache)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/rasti1608/PASC_Region_J.git
   cd PASC_Region_J
   ```

2. **Database Setup**
   - Create a new SQL Server database
   - Run the SQL scripts in `/database/schema.sql`
   - Update datasource name in `Application.cfc`

3. **Configure ColdFusion Datasource**
   - Open ColdFusion Administrator
   - Add datasource: `pasc_regionj`
   - Configure connection to your SQL Server database

4. **Set Application Variables**
   - Edit `Application.cfc`
   - Update `this.datasource` with your datasource name
   - Configure session timeout settings

5. **Create Admin User**
   - Run the admin user creation script
   - Or insert directly into `admin_users` table with hashed password

6. **Deploy Files**
   - Copy all files to your web root
   - Ensure `admin/` folder has proper permissions
   - Verify includes folder is accessible

7. **Test Installation**
   - Visit your site homepage
   - Login to `/admin/` with admin credentials
   - Create a test announcement

## 🔐 Security Features

- **Password Hashing** - Secure password storage with salt
- **Session Management** - Secure session handling with timeouts
- **SQL Injection Protection** - All queries use `cfqueryparam`
- **Authentication Checks** - Every admin page verifies login status
- **HTTPS Encryption** - Full SSL/TLS implementation
- **XSS Prevention** - HTML encoding on user inputs

## 📊 Key Features Implementation

### Announcement Ordering System
- **Add New**: Automatically becomes position #1, all others shift down
- **Delete**: Automatically closes gaps, renumbers remaining items
- **Reorder**: Dropdown selection with smart position swapping
- **Display**: Always shows in correct order on homepage

### Date-Based Publishing
- **Future Announcements**: Won't appear until `publish_start` date
- **Expired Announcements**: Automatically hidden after `publish_end` date
- **Active Status**: Manual toggle to show/hide immediately

### Status Indicators
- 🟢 **Live** - Currently visible on site
- ⚪ **Inactive** - Hidden from public view
- 🔵 **Future** - Scheduled for future publication

## 📈 Future Enhancements

- [ ] Gallery photo management system
- [ ] Online registration form with payment processing
- [ ] Workshop management admin panel
- [ ] Email notification system
- [ ] Multi-user admin roles & permissions
- [ ] Content versioning & revision history
- [ ] Analytics dashboard
- [ ] PDF generation for schedules/materials

## 💡 Development Notes

**Built with AI assistance** - This project was developed using Claude AI to accelerate development while maintaining professional code quality.

**Development Time**: ~25 hours (MVP)
**Lines of Code**: ~2,277
**Files**: 22

## 📄 License

MIT License - Feel free to use this code for your own projects!

## 👨‍💻 Author

**Rastislav Toscak**
- Email: rasto@comcast.net
- GitHub: [@rasti1608](https://github.com/rasti1608)

Built for Oliver Toscak's PASC Region J Conference 2026

## 🙏 Acknowledgments

- Pennsylvania Association of Student Councils (PASC)
- PASC Region J Leadership Team
- Neshaminy High School (Conference Host)

---

**⭐ If you find this project useful, please star the repository!**

*Last Updated: October 27, 2025*
