# Plan Pleno Backend

A Node.js backend for Plan Pleno, a Quito-focused application that helps users find activities based on categories and subcategories.

## Project Overview

Plan Pleno is a platform that enables users to:
1. Discover activities in Quito by categories (Sports, Food, Arts, etc.) and subcategories
2. Create profiles and save favorite activities
3. Leave reviews for activities they've experienced
4. Follow other users with similar interests (future scope)

The system is designed to be scalable, allowing for the addition of new categories and subcategories over time. It also includes a content management component for future business accounts.

## Technology Stack

- **Runtime**: Node.js with Express
- **Language**: TypeScript
- **Database**: 
  - PostgreSQL (for relational data: users, authentication, relationships)
  - MongoDB (for flexible content: activities, plans, categories)
- **Authentication**: JWT, Passport with Google OAuth and email/password
- **Testing**: Jest
- **API Documentation**: Swagger

## Architecture Design

### Database Design

#### PostgreSQL Schema

1. **Users**
   - id (PK)
   - email
   - passwordHash
   - googleId (nullable)
   - isEmailVerified
   - isBusinessAccount
   - role (enum: 'user', 'business', 'admin', 'superadmin')
   - createdAt
   - updatedAt

2. **UserProfiles**
   - id (PK)
   - userId (FK to Users)
   - displayName
   - bio
   - ageRange
   - profilePicture
   - createdAt
   - updatedAt

3. **UserRelationships**
   - id (PK)
   - followerId (FK to Users)
   - followedId (FK to Users)
   - createdAt

4. **UserSavedActivities**
   - id (PK)
   - userId (FK to Users)
   - activityId (stored as string, references MongoDB activity)
   - createdAt

5. **UserPreferences**
   - id (PK)
   - userId (FK to Users)
   - categoryId (stored as string, references MongoDB category)
   - weight (numerical preference value)

#### MongoDB Collections

1. **Categories**
   - _id
   - name
   - description
   - iconUrl

2. **Subcategories**
   - _id
   - name
   - description
   - iconUrl
   - parentCategories (array of category IDs)

3. **Activities**
   - _id
   - name
   - description
   - images (array)
   - location
     - address
     - coordinates (for geospatial queries)
     - mapUrl
   - categoryId (reference to Categories)
   - subcategoryIds (array of references to Subcategories)
   - schedule
     - type (one-time or recurring)
     - dates (for one-time events)
     - recurringSchedule (for recurring events)
   - price (optional)
   - duration (optional)
   - ageRestriction (optional)
   - createdAt
   - updatedAt

4. **Reviews**
   - _id
   - activityId (reference to Activities)
   - userId (reference to PostgreSQL Users)
   - rating (boolean: thumbs up/down)
   - comment (text)
   - createdAt

### API Endpoints

#### Authentication
- POST `/api/auth/register`: Register a new user
- POST `/api/auth/verify-email`: Verify email with token
- POST `/api/auth/login`: Login with email/password
- GET `/api/auth/google`: Login with Google
- GET `/api/auth/google/callback`: Google OAuth callback
- POST `/api/auth/forgot-password`: Request password reset
- POST `/api/auth/reset-password`: Reset password with token

#### Users
- GET `/api/users/me`: Get current user profile
- PUT `/api/users/profile`: Update user profile
- GET `/api/users/:id`: Get public user profile
- POST `/api/users/follow/:id`: Follow a user
- DELETE `/api/users/follow/:id`: Unfollow a user
- GET `/api/users/followers`: Get current user's followers
- GET `/api/users/following`: Get users the current user follows

#### Categories
- GET `/api/categories`: Get all categories
- GET `/api/categories/:id`: Get category details
- GET `/api/categories/:id/subcategories`: Get subcategories for a category
- GET `/api/subcategories`: Get all subcategories
- GET `/api/subcategories/:id`: Get subcategory details

#### Activities
- GET `/api/activities`: Get activities (filterable by category, subcategory, location)
- GET `/api/activities/:id`: Get activity details
- POST `/api/activities/:id/save`: Save an activity
- DELETE `/api/activities/:id/save`: Remove saved activity
- GET `/api/activities/saved`: Get user's saved activities
- GET `/api/activities/recommendations`: Get recommended activities (future scope)

#### Reviews
- POST `/api/reviews`: Create a review for an activity
- GET `/api/activities/:id/reviews`: Get reviews for an activity
- GET `/api/users/me/reviews`: Get current user's reviews
- DELETE `/api/reviews/:id`: Delete a review

#### Admin
- GET `/api/admin/dashboard`: Get admin dashboard statistics
- GET `/api/admin/users`: Get all users (with filtering/pagination)
- PUT `/api/admin/users/:id`: Update user details
- PATCH `/api/admin/users/:id/status`: Change user status (activate/deactivate)
- GET `/api/admin/activities`: Get all activities (with filtering/pagination) 
- PUT `/api/admin/activities/:id`: Update activity details
- DELETE `/api/admin/activities/:id`: Remove activity
- GET `/api/admin/categories`: Manage categories
- POST `/api/admin/categories`: Create new category
- PUT `/api/admin/categories/:id`: Update category
- DELETE `/api/admin/categories/:id`: Remove category
- GET `/api/admin/reviews`: Get all reviews (with filtering/pagination)
- DELETE `/api/admin/reviews/:id`: Remove inappropriate review

### Middleware

1. **Authentication**: Verify JWT tokens
2. **Authorization**: Check user permissions
3. **Rate Limiting**: Prevent abuse
4. **Request Validation**: Validate request data
5. **Error Handling**: Centralized error handling
6. **Logging**: Request/response logging
7. **Role-Based Access Control**: Check user roles for admin operations

## Implementation Plan

### Phase 1: Project Setup and Core Infrastructure
- Initialize project with TypeScript
- Set up linting and code formatting
- Configure PostgreSQL and MongoDB connections
- Implement basic Express server
- Set up environment configuration

### Phase 2: Authentication and User Management
- Implement email/password authentication
- Add Google OAuth integration
- Create user profile management
- Implement email verification
- Set up password reset flow

### Phase 3: Content Management
- Design and implement category/subcategory models
- Create activity model with all required attributes
- Implement location-based search functionality
- Set up review system

### Phase 4: Social Features
- Implement user following system
- Add saved activities functionality
- Design activity recommendation system (base version)

### Phase 5: Testing and Documentation
- Write unit and integration tests
- Create Swagger API documentation
- Set up automated testing

### Phase 6: Performance and Security
- Add rate limiting and security headers
- Optimize database queries
- Implement caching for frequent requests
- Set up monitoring

## Security Considerations

- Use bcrypt for password hashing
- Implement proper JWT handling
- Add CORS protection
- Use Helmet for security headers
- Validate all inputs
- Implement rate limiting
- Set up proper error handling to avoid leaking sensitive information
- Implement role-based access control (RBAC)
- Use middleware to restrict admin routes based on user roles

## Future Enhancements

- Business accounts for activity management
- Advanced recommendation system based on user preferences
- Real-time notifications
- Chat functionality between users
- Monetization features for businesses
- Analytics dashboard for business accounts

## Development Guidelines

- Use meaningful commit messages following conventional commits
- Write tests for all new features
- Document API endpoints with JSDoc comments
- Follow the project's code style
- Keep dependencies up to date

## Project Structure

```
src/
├── config/                # Configuration files
│   ├── database.ts        # Database configuration
│   ├── auth.ts            # Authentication configuration
│   ├── email.ts           # Email service configuration
│   └── index.ts           # Export all configurations
├── db/                    # Database connections and utilities
│   ├── mongo.ts           # MongoDB connection
│   └── postgres.ts        # PostgreSQL connection
├── features/              # Domain-specific features
│   ├── auth/              # Authentication and authorization
│   │   ├── controllers/   # Auth controllers
│   │   ├── middlewares/   # Auth middlewares
│   │   ├── services/      # Auth business logic
│   │   ├── __tests__/     # Auth tests
│   │   │   ├── unit/      # Unit tests
│   │   │   └── integration/# Integration tests
│   │   ├── routes.ts      # Auth routes
│   │   └── index.ts       # Auth module exports
│   ├── users/             # User management
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── __tests__/     # User tests
│   │   │   ├── unit/
│   │   │   └── integration/
│   │   ├── routes.ts
│   │   └── index.ts
│   ├── admin/             # Admin panel and management
│   │   ├── controllers/   # Admin controllers 
│   │   ├── services/      # Admin business logic
│   │   ├── __tests__/     # Admin tests
│   │   │   ├── unit/
│   │   │   └── integration/
│   │   ├── routes.ts      # Admin routes
│   │   └── index.ts       # Admin module exports
│   ├── categories/        # Category and subcategory management
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── __tests__/     # Category tests
│   │   │   ├── unit/
│   │   │   └── integration/
│   │   ├── routes.ts
│   │   └── index.ts
│   ├── activities/        # Activity management
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── __tests__/     # Activity tests
│   │   │   ├── unit/
│   │   │   └── integration/
│   │   ├── routes.ts
│   │   └── index.ts
│   └── reviews/           # Review system
│       ├── controllers/
│       ├── services/
│       ├── __tests__/     # Review tests
│       │   ├── unit/
│       │   └── integration/
│       ├── routes.ts
│       └── index.ts
├── models/                # Database models
│   ├── postgres/          # PostgreSQL models
│   │   ├── user.ts
│   │   ├── userProfile.ts
│   │   ├── userSavedActivity.ts
│   │   ├── userPreference.ts
│   │   └── userRelationship.ts
│   └── mongo/             # MongoDB schemas
│       ├── category.ts
│       ├── subcategory.ts
│       ├── activity.ts
│       └── review.ts
├── common/                # Shared code
│   ├── interfaces/        # Shared interfaces
│   ├── types/             # Shared types
│   ├── middlewares/       # Common middlewares
│   │   ├── error.ts       # Error handling middleware
│   │   ├── validation.ts  # Request validation
│   │   └── rateLimiter.ts # Rate limiting
│   └── utils/             # Helper functions
│       ├── logger.ts
│       ├── validators.ts
│       └── responses.ts
├── tests/                 # Global test utilities and E2E tests
│   ├── fixtures/          # Test data and fixtures
│   ├── utils/             # Test utilities
│   └── e2e/               # End-to-end tests
├── app.ts                 # Express app setup
└── index.ts               # Entry point
```

Domain-driven design approach, organizing code by business features rather than technical function. It improves maintainability and scalability by:

1. **Encapsulating related functionality**: Each feature module contains everything it needs
2. **Reducing dependencies**: Features are isolated with clear boundaries
3. **Simplifying navigation**: Developers can easily find code related to a specific domain
4. **Enabling parallel development**: Teams can work on different features simultaneously
5. **Facilitating testing**: Domain-specific code can be tested as a unit

## Testing Strategy

The testing approach follows the domain-driven structure of the codebase:

### Unit Tests
- Located within each feature module's `__tests__/unit/` directory
- Test individual functions and methods in isolation
- Use mocks for external dependencies
- Focus on business logic in service layers

### Integration Tests
- Located within each feature module's `__tests__/integration/` directory
- Test interaction between components within a feature
- May include database operations with test databases
- Verify that controllers, services, and models work together

### End-to-End Tests
- Located in the global `tests/e2e/` directory
- Test complete user flows across multiple features
- Use a test instance of the API
- Verify that the system works as a whole

### Test Utilities and Fixtures
- Common test utilities in `tests/utils/`
- Test data and fixtures in `tests/fixtures/`
- Reusable across different test types

### Testing Best Practices
- Write tests during feature development, not after
- Aim for high test coverage, especially for critical paths
- Use descriptive test names that explain the expected behavior
- Implement CI/CD pipeline to run tests automatically
