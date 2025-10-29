"""
Business: Process Telegram Stars purchase orders via Telegram Bot API and save to database
Args: event - dict with httpMethod, body containing username and star_amount
      context - object with request_id attribute
Returns: HTTP response with transaction status and telegram confirmation
"""

import json
import os
from typing import Dict, Any
import urllib.request
import urllib.error
import psycopg2
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
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
        body_data = json.loads(event.get('body', '{}'))
        username: str = body_data.get('username', '').strip().lstrip('@')
        star_amount: int = body_data.get('star_amount', 0)
        
        if not username:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Username is required'}),
                'isBase64Encoded': False
            }
        
        if star_amount <= 0:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Invalid star amount'}),
                'isBase64Encoded': False
            }
        
        bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
        database_url = os.environ.get('DATABASE_URL')
        
        if not bot_token:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Bot token not configured'}),
                'isBase64Encoded': False
            }
        
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
        
        price_usd = star_amount * 0.10
        conn = None
        
        try:
            conn = psycopg2.connect(database_url)
            cursor = conn.cursor()
            
            cursor.execute(
                "INSERT INTO orders (username, star_amount, price_usd, status, transaction_id) "
                "VALUES (%s, %s, %s, %s, %s) RETURNING id",
                (username, star_amount, price_usd, 'pending', context.request_id)
            )
            order_id = cursor.fetchone()[0]
            conn.commit()
            cursor.close()
            
        except Exception as db_error:
            if conn:
                conn.rollback()
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': f'Database error: {str(db_error)}'}),
                'isBase64Encoded': False
            }
        finally:
            if conn:
                conn.close()
        
        message_text = f"✨ Новый заказ Telegram Stars!\n\n" \
                      f"👤 Username: @{username}\n" \
                      f"⭐ Количество: {star_amount:,} Stars\n" \
                      f"💰 Сумма: ${price_usd:.2f}\n\n" \
                      f"🔄 Статус: Ожидает обработки\n" \
                      f"📦 Заказ #{order_id}\n" \
                      f"📝 ID транзакции: {context.request_id}"
        
        telegram_api_url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
        
        request_data = json.dumps({
            'chat_id': username,
            'text': message_text,
            'parse_mode': 'HTML'
        }).encode('utf-8')
        
        req = urllib.request.Request(
            telegram_api_url,
            data=request_data,
            headers={'Content-Type': 'application/json'}
        )
        
        try:
            with urllib.request.urlopen(req, timeout=10) as response:
                telegram_response = json.loads(response.read().decode('utf-8'))
                
                if telegram_response.get('ok'):
                    try:
                        conn = psycopg2.connect(database_url)
                        cursor = conn.cursor()
                        cursor.execute(
                            "UPDATE orders SET status = %s, updated_at = %s WHERE id = %s",
                            ('sent', datetime.utcnow(), order_id)
                        )
                        conn.commit()
                        cursor.close()
                        conn.close()
                    except Exception:
                        pass
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({
                            'success': True,
                            'order_id': order_id,
                            'transaction_id': context.request_id,
                            'username': username,
                            'star_amount': star_amount,
                            'message': 'Order sent to Telegram successfully'
                        }),
                        'isBase64Encoded': False
                    }
                else:
                    error_description = telegram_response.get('description', 'Unknown error')
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({
                            'error': f'Telegram API error: {error_description}'
                        }),
                        'isBase64Encoded': False
                    }
        
        except urllib.error.HTTPError as e:
            error_body = e.read().decode('utf-8')
            return {
                'statusCode': 502,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': f'Telegram API request failed: {error_body}'
                }),
                'isBase64Encoded': False
            }
    
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Invalid JSON in request body'}),
            'isBase64Encoded': False
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': f'Internal server error: {str(e)}'}),
            'isBase64Encoded': False
        }