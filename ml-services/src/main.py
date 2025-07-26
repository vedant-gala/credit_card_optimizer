from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import os
from dotenv import load_dotenv

from models.transaction_categorizer import TransactionCategorizer
from models.recommendation_engine import RecommendationEngine
from services.prediction_service import PredictionService

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Credit Card Optimizer ML Services",
    description="Machine Learning services for transaction categorization and recommendations",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
prediction_service = PredictionService()

class TransactionData(BaseModel):
    merchant: str
    amount: float
    description: Optional[str] = None

class CategorizationRequest(BaseModel):
    transactions: List[TransactionData]

class CategorizationResponse(BaseModel):
    categories: List[str]
    confidence_scores: List[float]

class RecommendationRequest(BaseModel):
    user_id: str
    spending_history: List[dict]
    current_cards: List[str]

class RecommendationResponse(BaseModel):
    recommended_cards: List[str]
    reasons: List[str]
    expected_rewards: float

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ml-services"}

@app.post("/categorize", response_model=CategorizationResponse)
async def categorize_transactions(request: CategorizationRequest):
    try:
        categories, confidence_scores = await prediction_service.categorize_transactions(
            request.transactions
        )
        return CategorizationResponse(
            categories=categories,
            confidence_scores=confidence_scores
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recommend", response_model=RecommendationResponse)
async def get_recommendations(request: RecommendationRequest):
    try:
        recommendations = await prediction_service.get_recommendations(
            request.user_id,
            request.spending_history,
            request.current_cards
        )
        return RecommendationResponse(**recommendations)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/models/status")
async def get_model_status():
    return {
        "categorizer": prediction_service.categorizer.is_loaded(),
        "recommendation_engine": prediction_service.recommendation_engine.is_loaded()
    }

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port) 