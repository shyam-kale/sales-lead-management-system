# Contributing to Sales Lead Management System

Thank you for your interest in contributing to the Sales Lead Management System! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### 1. Fork the Repository
- Click the "Fork" button on the GitHub repository page
- Clone your forked repository to your local machine

### 2. Set Up Development Environment
```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/sales-lead-management.git
cd sales-lead-management

# Set up the project (see README.md for detailed instructions)
./run.sh
```

### 3. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b bugfix/issue-description
```

### 4. Make Your Changes
- Follow the existing code style and conventions
- Add tests for new functionality
- Update documentation as needed
- Ensure all tests pass

### 5. Commit Your Changes
```bash
git add .
git commit -m "feat: add new feature description"
# or
git commit -m "fix: resolve issue description"
```

### 6. Push and Create Pull Request
```bash
git push origin feature/your-feature-name
```
Then create a pull request on GitHub.

## 📝 Coding Standards

### Backend (Java/Spring Boot)
- Follow Java naming conventions
- Use proper JavaDoc comments
- Implement proper error handling
- Write unit tests for new methods
- Follow REST API best practices

### Frontend (React)
- Use functional components with hooks
- Follow React best practices
- Use meaningful component and variable names
- Implement proper error boundaries
- Write clean, readable CSS

### Database
- Use proper naming conventions for tables and columns
- Include appropriate indexes
- Write migration scripts for schema changes
- Document complex queries

## 🧪 Testing

### Backend Testing
```bash
cd backend
mvn test
```

### Frontend Testing
```bash
cd frontend
npm test
```

### Integration Testing
- Test API endpoints with Postman or similar tools
- Verify database operations
- Test frontend-backend integration

## 📋 Pull Request Guidelines

### Before Submitting
- [ ] Code follows project conventions
- [ ] Tests pass locally
- [ ] Documentation is updated
- [ ] No console errors or warnings
- [ ] Database migrations are included (if applicable)

### Pull Request Description
Please include:
- **What**: Brief description of changes
- **Why**: Reason for the changes
- **How**: Technical approach used
- **Testing**: How you tested the changes
- **Screenshots**: For UI changes

### Example PR Description
```markdown
## What
Added user profile avatar upload functionality

## Why
Users requested the ability to upload custom profile pictures

## How
- Added file upload endpoint in UserProfileController
- Implemented image processing and storage
- Updated frontend with drag-and-drop upload component

## Testing
- Tested file upload with various image formats
- Verified image resizing and optimization
- Tested error handling for invalid files

## Screenshots
[Include screenshots of the new feature]
```

## 🐛 Bug Reports

When reporting bugs, please include:
- **Environment**: OS, browser, Java version, etc.
- **Steps to reproduce**: Clear steps to reproduce the issue
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Screenshots**: If applicable
- **Console logs**: Any error messages

## 💡 Feature Requests

For new features, please provide:
- **Use case**: Why is this feature needed?
- **Description**: Detailed description of the feature
- **Mockups**: UI mockups if applicable
- **Technical considerations**: Any technical challenges

## 🏷️ Commit Message Convention

We follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
```
feat: add user profile avatar upload
fix: resolve dashboard loading issue
docs: update API documentation
style: format code according to style guide
refactor: optimize database queries
test: add unit tests for user service
chore: update dependencies
```

## 🔍 Code Review Process

1. **Automated Checks**: All PRs must pass automated tests
2. **Peer Review**: At least one maintainer will review your PR
3. **Feedback**: Address any feedback or requested changes
4. **Approval**: PR will be merged after approval

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and general discussion
- **Documentation**: Check README.md and other docs first

## 🎯 Areas for Contribution

We welcome contributions in these areas:
- **Bug fixes**: Check open issues
- **New features**: See roadmap in README.md
- **Documentation**: Improve existing docs
- **Testing**: Add more test coverage
- **Performance**: Optimize existing code
- **UI/UX**: Improve user experience
- **Accessibility**: Make the app more accessible

## 📜 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow project guidelines
- Maintain a positive environment

Thank you for contributing to the Sales Lead Management System! 🚀