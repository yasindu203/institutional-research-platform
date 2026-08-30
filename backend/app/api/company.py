from fastapi import APIRouter, HTTPException
import yfinance as yf

router = APIRouter()

@router.get("/{ticker}")
async def get_company_info(ticker: str):
    """
    Fetch live company metadata from Yahoo Finance.
    Returns price, market cap, P/E, sector, shares outstanding, FCF, debt/cash.
    """
    try:
        t = yf.Ticker(ticker.upper())
        info = t.info

        if not info or not info.get("shortName"):
            raise HTTPException(status_code=404, detail=f"No data found for ticker {ticker.upper()}")

        # Safe get helper
        def sg(key, default=None):
            return info.get(key, default)

        market_cap = sg("marketCap", 0)
        shares = sg("sharesOutstanding", sg("impliedSharesOutstanding", 1))
        current_price = sg("currentPrice", sg("regularMarketPrice", sg("previousClose", 0)))
        pe = sg("trailingPE", sg("forwardPE"))
        free_cash_flow = sg("freeCashflow", 0)
        total_debt = sg("totalDebt", 0)
        total_cash = sg("totalCash", 0)
        net_debt = total_debt - total_cash  # positive = net debt, negative = net cash
        revenue = sg("totalRevenue", 0)

        return {
            "ticker": ticker.upper(),
            "name": sg("shortName", sg("longName", ticker.upper())),
            "exchange": sg("exchange", sg("fullExchangeName", "N/A")),
            "sector": sg("sector", "N/A"),
            "industry": sg("industry", "N/A"),
            "description": sg("longBusinessSummary", ""),
            "current_price": current_price,
            "market_cap": market_cap,
            "market_cap_b": round(market_cap / 1e9, 2) if market_cap else None,
            "pe_ratio": round(pe, 2) if pe else None,
            "shares_outstanding_m": round(shares / 1e6, 2) if shares else None,
            "free_cash_flow": free_cash_flow,
            "free_cash_flow_m": round(free_cash_flow / 1e6, 0) if free_cash_flow else None,
            "net_debt_m": round(net_debt / 1e6, 0) if net_debt else None,
            "revenue": revenue,
            "revenue_m": round(revenue / 1e6, 0) if revenue else None,
            "52w_high": sg("fiftyTwoWeekHigh"),
            "52w_low": sg("fiftyTwoWeekLow"),
            "website": sg("website", ""),
            "employees": sg("fullTimeEmployees"),
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"[company] Error fetching {ticker}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch data for {ticker.upper()}: {str(e)}")
