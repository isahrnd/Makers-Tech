# ChatBot Makers Tech - Intelligent Technology Assistance System

## Project Description

This project is an intelligent ChatBot developed for the technology e-commerce company "Makers Tech". 
The system allows users to query information about inventory, prices, and product characteristics through a modern and user-friendly conversational interface.

The ChatBot uses basic natural language processing to understand user queries and provide personalized responses about computers, smartphones, and accessories available in the store.

## Technologies Used

- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS with custom design system
- **UI Components:** shadcn/ui (Radix UI)
- **Charts:** Recharts
- **Build Tool:** Vite
- **Routing:** React Router DOM
- **Supported by Lovable to create a more pleasant visual interface**

## How to Install and Run

### Prerequisites
- Node.js 18+ installed
- npm 

### Installation
```bash
# Clone the repository
git clone 

# Navigate to project directory
cd Makers-Tech

# Install dependencies
npm install

# Run in development mode
npm run dev
```

The project will be available at `http://localhost:8080`

## What the Bot Does

The Makers Tech ChatBot can:

### Main Functionalities:
- **Inventory Queries:** Answers questions about available stock, quantity of products by category and brand
- **Price Information:** Provides individual prices, price ranges, and comparisons
- **Technical Specifications:** Shows detailed product characteristics (processor, RAM, storage, etc.)
- **Intelligent Recommendations:** Suggests products based on rating and availability
- **Search by Brand/Product:** Filters information by specific brands (HP, Dell, Apple, Samsung, etc.)

### Interaction Examples:
- "How many computers do you have available?" → Shows computer inventory by brand
- "iPhone price" → Shows price and details of available iPhone
- "MacBook specifications" → Displays complete technical specifications
- "Recommend something" → Suggests top 3 highest-rated products

## Recommendation System and Dashboard
- its missing some things but i try to do it 
### Administrative Dashboard
- **Real-time Metrics:** Updated inventory statistics
- **Graphic Visualizations:**
  - Bar chart: Products by category
  - Area chart: Stock distribution
  - Pie chart: Products by brand
- **Main KPIs:** Total products, total stock, average price
- **Detailed Data:** Tables with complete product information

### Code Architecture
- **Modular and Maintainable:** Clear separation between services (NLP, bot engine, inventory manager)
- **Commented Code:** Detailed explanations in Spanish for easy modification
- **Easy Extension:** Structure that allows adding new functionalities without problems
