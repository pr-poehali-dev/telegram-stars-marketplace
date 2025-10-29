"""
Business: Get orders history from database
Args: event - dict with httpMethod, optional queryStringParameters with username filter
      context - object with request_id attribute
Returns: HTTP response with list of orders
"""

import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        database_url = os.environ.get('DATABASE_URL')
        if not database_url:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Database not configured'}),
                'isBase64Encoded': False
            }
        
        query_params = event.get('queryStringParameters') or {}
        username_filter = query_params.get('username')
        limit = int(query_params.get('limit', 50))
        
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        if username_filter:
            cursor.execute(
                "SELECT id, username, star_amount, price_usd, status, transaction_id, "
                "created_at, updated_at FROM orders WHERE username = %s "
                "ORDER BY created_at DESC LIMIT %s",
                (username_filter, limit)
            )
        else:
            cursor.execute(
                "SELECT id, username, star_amount, price_usd, status, transaction_id, "
                "created_at, updated_at FROM orders "
                "ORDER BY created_at DESC LIMIT %s",
                (limit,)
            )
        
        orders = cursor.fetchall()
        cursor.close()
        conn.close()
        
        orders_list = []
        for order in orders:
            orders_list.append({
                'id': order['id'],
                'username': order['username'],
                'star_amount': order['star_amount'],
                'price_usd': float(order['price_usd']),
                'status': order['status'],
                'transaction_id': order['transaction_id'],
                'created_at': order['created_at'].isoformat() if order['created_at'] else None,
                'updated_at': order['updated_at'].isoformat() if order['updated_at'] else None
            })
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'orders': orders_list,
                'count': len(orders_list)
            }),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': f'Server error: {str(e)}'}),
            'isBase64Encoded': False
        }
