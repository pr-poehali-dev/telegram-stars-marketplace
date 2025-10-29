import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const marketplaceItems = [
    {
      id: 1,
      seller: 'CryptoWhale',
      amount: 1000,
      price: 99.99,
      rating: 4.8,
      trades: 342
    },
    {
      id: 2,
      seller: 'StarTrader',
      amount: 5000,
      price: 485.00,
      rating: 4.9,
      trades: 523
    },
    {
      id: 3,
      seller: 'MegaDeals',
      amount: 500,
      price: 52.50,
      rating: 4.7,
      trades: 189
    },
    {
      id: 4,
      seller: 'QuickStar',
      amount: 2500,
      price: 242.00,
      rating: 4.9,
      trades: 756
    }
  ];

  const recentTransactions = [
    { id: 1, type: 'buy', amount: 1000, price: 99.99, status: 'completed', time: '2 мин назад' },
    { id: 2, type: 'sell', amount: 500, price: 52.50, status: 'pending', time: '15 мин назад' },
    { id: 3, type: 'buy', amount: 2500, price: 242.00, status: 'completed', time: '1 час назад' },
    { id: 4, type: 'sell', amount: 750, price: 78.75, status: 'completed', time: '3 часа назад' }
  ];

  const handleBuyClick = (item: any) => {
    setSelectedItem(item);
    setPurchaseAmount(item.amount.toString());
    setPurchaseDialogOpen(true);
  };

  const handlePurchaseConfirm = async () => {
    setIsProcessing(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setPurchaseDialogOpen(false);
    setIsProcessing(false);
    setPurchaseAmount('');
    
    toast({
      title: '✅ Покупка успешна!',
      description: `Вы купили ${purchaseAmount} ⭐ за $${(parseFloat(purchaseAmount) * 0.10).toFixed(2)}. Уведомление отправлено в Telegram.`,
      duration: 5000,
    });
  };

  const calculateTotal = () => {
    if (!purchaseAmount || !selectedItem) return '0.00';
    const amount = parseFloat(purchaseAmount);
    const pricePerStar = selectedItem.price / selectedItem.amount;
    return (amount * pricePerStar).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="glass-card sticky top-0 z-50 border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center neon-glow">
                <Icon name="Star" size={24} className="text-white" />
              </div>
              <h1 className="text-2xl font-heading font-bold gradient-text">StarMarket</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                <Icon name="Bell" size={18} />
              </Button>
              <Avatar className="border-2 border-primary">
                <AvatarFallback className="bg-secondary text-white">U</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="glass-card p-1 h-auto">
            <TabsTrigger value="home" className="data-[state=active]:bg-primary/20">
              <Icon name="Home" size={18} className="mr-2" />
              Главная
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="data-[state=active]:bg-primary/20">
              <Icon name="ShoppingBag" size={18} className="mr-2" />
              Маркетплейс
            </TabsTrigger>
            <TabsTrigger value="wallet" className="data-[state=active]:bg-primary/20">
              <Icon name="Wallet" size={18} className="mr-2" />
              Кошелек
            </TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-primary/20">
              <Icon name="ArrowLeftRight" size={18} className="mr-2" />
              Транзакции
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-primary/20">
              <Icon name="User" size={18} className="mr-2" />
              Профиль
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-8 animate-fade-in">
            <section className="relative overflow-hidden rounded-3xl glass-card p-12 border-2 border-primary/30">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10" />
              <div className="relative z-10 max-w-3xl">
                <Badge className="mb-4 bg-primary/20 text-primary border-primary/50">Платформа №1</Badge>
                <h2 className="text-5xl font-heading font-bold mb-4 gradient-text">
                  Торгуйте Telegram Stars безопасно
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Децентрализованная платформа для покупки и продажи Telegram Stars с мгновенными транзакциями через Telegram Bot API
                </p>
                <div className="flex gap-4">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 neon-glow">
                    <Icon name="Rocket" size={20} className="mr-2" />
                    Начать торговлю
                  </Button>
                  <Button size="lg" variant="outline" className="border-2 border-primary/50 hover:bg-primary/10">
                    <Icon name="PlayCircle" size={20} className="mr-2" />
                    Как это работает
                  </Button>
                </div>
              </div>
            </section>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="glass-card border-primary/30 hover:border-primary/60 transition-all hover:scale-105">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                    <Icon name="Zap" size={24} className="text-primary" />
                  </div>
                  <CardTitle className="font-heading">Мгновенно</CardTitle>
                  <CardDescription>Транзакции через Telegram Bot за секунды</CardDescription>
                </CardHeader>
              </Card>

              <Card className="glass-card border-secondary/30 hover:border-secondary/60 transition-all hover:scale-105">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center mb-4">
                    <Icon name="Shield" size={24} className="text-secondary" />
                  </div>
                  <CardTitle className="font-heading">Безопасно</CardTitle>
                  <CardDescription>Эскроу-сервис и проверенные продавцы</CardDescription>
                </CardHeader>
              </Card>

              <Card className="glass-card border-accent/30 hover:border-accent/60 transition-all hover:scale-105">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
                    <Icon name="Bell" size={24} className="text-accent" />
                  </div>
                  <CardTitle className="font-heading">Уведомления</CardTitle>
                  <CardDescription>Push-оповещения о статусе сделок</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                { label: 'Объем торгов 24ч', value: '$1.2M', icon: 'TrendingUp', change: '+12.5%' },
                { label: 'Активных трейдеров', value: '15.4K', icon: 'Users', change: '+8.2%' },
                { label: 'Завершенных сделок', value: '42.8K', icon: 'CheckCircle', change: '+15.7%' },
                { label: 'Средний рейтинг', value: '4.9', icon: 'Star', change: '+0.2' }
              ].map((stat, idx) => (
                <Card key={idx} className="glass-card">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <Icon name={stat.icon as any} size={20} className="text-primary" />
                      <Badge variant="secondary" className="text-xs">{stat.change}</Badge>
                    </div>
                    <p className="text-3xl font-heading font-bold mb-1">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="marketplace" className="animate-fade-in">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input 
                  placeholder="Поиск по продавцам..." 
                  className="glass-card h-12"
                />
              </div>
              <Button variant="outline" className="glass-card">
                <Icon name="SlidersHorizontal" size={18} className="mr-2" />
                Фильтры
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {marketplaceItems.map((item) => (
                <Card key={item.id} className="glass-card hover:border-primary/60 transition-all group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="border-2 border-primary">
                          <AvatarFallback className="bg-secondary text-white">
                            {item.seller[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg font-heading">{item.seller}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center">
                              <Icon name="Star" size={14} className="text-yellow-500 mr-1" />
                              <span className="text-sm font-semibold">{item.rating}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{item.trades} сделок</span>
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-primary/20 text-primary border-primary/50">Проверен</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Количество</p>
                          <p className="text-2xl font-heading font-bold gradient-text">
                            {item.amount.toLocaleString()} ⭐
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground mb-1">Цена</p>
                          <p className="text-2xl font-heading font-bold">${item.price}</p>
                        </div>
                      </div>
                      <Button 
                        className="w-full bg-primary hover:bg-primary/90 group-hover:neon-glow"
                        onClick={() => handleBuyClick(item)}
                      >
                        <Icon name="ShoppingCart" size={18} className="mr-2" />
                        Купить сейчас
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="wallet" className="animate-fade-in space-y-6">
            <Card className="glass-card border-2 border-primary/30">
              <CardHeader>
                <CardTitle className="font-heading">Мой кошелек</CardTitle>
                <CardDescription>Управляйте своими Telegram Stars</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 border border-primary/30">
                  <p className="text-sm text-muted-foreground mb-2">Доступный баланс</p>
                  <p className="text-5xl font-heading font-bold gradient-text mb-4">
                    12,500 ⭐
                  </p>
                  <p className="text-lg text-muted-foreground">≈ $1,287.50 USD</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    <Icon name="ArrowUp" size={20} className="mr-2" />
                    Вывести
                  </Button>
                  <Button size="lg" variant="outline" className="border-2 border-primary/50">
                    <Icon name="ArrowDown" size={20} className="mr-2" />
                    Пополнить
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Недельная активность</span>
                    <span className="text-sm text-muted-foreground">75% от лимита</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Куплено</p>
                    <p className="text-lg font-heading font-bold text-green-500">+5,000 ⭐</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Продано</p>
                    <p className="text-lg font-heading font-bold text-red-500">-2,500 ⭐</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Комиссии</p>
                    <p className="text-lg font-heading font-bold">125 ⭐</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="animate-fade-in">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="font-heading">История транзакций</CardTitle>
                <CardDescription>Все ваши покупки и продажи</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((tx) => (
                    <div 
                      key={tx.id}
                      className="flex items-center justify-between p-4 rounded-xl glass-card hover:border-primary/50 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          tx.type === 'buy' ? 'bg-green-500/20' : 'bg-red-500/20'
                        }`}>
                          <Icon 
                            name={tx.type === 'buy' ? 'ArrowDown' : 'ArrowUp'} 
                            size={20}
                            className={tx.type === 'buy' ? 'text-green-500' : 'text-red-500'}
                          />
                        </div>
                        <div>
                          <p className="font-semibold">
                            {tx.type === 'buy' ? 'Покупка' : 'Продажа'} {tx.amount} ⭐
                          </p>
                          <p className="text-sm text-muted-foreground">{tx.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-heading font-bold">${tx.price}</p>
                        <Badge 
                          variant={tx.status === 'completed' ? 'default' : 'secondary'}
                          className={tx.status === 'completed' ? 'bg-green-500/20 text-green-500' : ''}
                        >
                          {tx.status === 'completed' ? 'Завершено' : 'В обработке'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="animate-fade-in">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="glass-card md:col-span-1">
                <CardHeader className="text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary">
                    <AvatarFallback className="bg-secondary text-white text-3xl">U</AvatarFallback>
                  </Avatar>
                  <CardTitle className="font-heading">@username</CardTitle>
                  <CardDescription>Активен с января 2025</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                    <span className="text-sm">Рейтинг</span>
                    <div className="flex items-center gap-1">
                      <Icon name="Star" size={16} className="text-yellow-500" />
                      <span className="font-bold">4.9</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                    <span className="text-sm">Сделок</span>
                    <span className="font-bold">127</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                    <span className="text-sm">Объем</span>
                    <span className="font-bold">$15.2K</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card md:col-span-2">
                <CardHeader>
                  <CardTitle className="font-heading">Настройки профиля</CardTitle>
                  <CardDescription>Управление аккаунтом и уведомлениями</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Telegram Username</label>
                      <Input placeholder="@username" className="glass-card" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email для уведомлений</label>
                      <Input type="email" placeholder="user@example.com" className="glass-card" />
                    </div>
                  </div>

                  <div className="space-y-4 pt-6 border-t">
                    <h3 className="font-heading font-semibold">Уведомления</h3>
                    {[
                      'Push-уведомления о новых сделках',
                      'Email-уведомления о статусе транзакций',
                      'Telegram-боты для автоматических операций'
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                        <span className="text-sm">{item}</span>
                        <div className="w-10 h-6 bg-primary rounded-full"></div>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full bg-primary hover:bg-primary/90">
                    <Icon name="Save" size={18} className="mr-2" />
                    Сохранить изменения
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={purchaseDialogOpen} onOpenChange={setPurchaseDialogOpen}>
        <DialogContent className="glass-card sm:max-w-[500px] border-primary/30">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading gradient-text">
              Подтверждение покупки
            </DialogTitle>
            <DialogDescription>
              Купите Telegram Stars у проверенного продавца
            </DialogDescription>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                <Avatar className="w-12 h-12 border-2 border-primary">
                  <AvatarFallback className="bg-secondary text-white">
                    {selectedItem.seller[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-heading font-semibold">{selectedItem.seller}</p>
                  <div className="flex items-center gap-2">
                    <Icon name="Star" size={14} className="text-yellow-500" />
                    <span className="text-sm">{selectedItem.rating}</span>
                    <span className="text-xs text-muted-foreground">• {selectedItem.trades} сделок</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Количество Stars</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Введите количество"
                  value={purchaseAmount}
                  onChange={(e) => setPurchaseAmount(e.target.value)}
                  className="glass-card text-lg"
                  max={selectedItem.amount}
                />
                <p className="text-xs text-muted-foreground">
                  Доступно: {selectedItem.amount.toLocaleString()} ⭐
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 border border-primary/30 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Цена за 1 ⭐</span>
                  <span className="font-semibold">${(selectedItem.price / selectedItem.amount).toFixed(3)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Количество</span>
                  <span className="font-semibold">{purchaseAmount || 0} ⭐</span>
                </div>
                <div className="h-px bg-border my-2"></div>
                <div className="flex justify-between items-center">
                  <span className="font-heading font-bold text-lg">Итого</span>
                  <span className="font-heading font-bold text-2xl gradient-text">
                    ${calculateTotal()}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/10 border border-primary/30">
                <Icon name="Info" size={20} className="text-primary mt-0.5" />
                <div className="text-sm space-y-1">
                  <p className="font-semibold text-primary">Мгновенная доставка через Telegram Bot</p>
                  <p className="text-muted-foreground">
                    После оплаты Stars будут переведены на ваш аккаунт автоматически. 
                    Вы получите push-уведомление о статусе транзакции.
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setPurchaseDialogOpen(false)}
              disabled={isProcessing}
              className="border-2 border-muted"
            >
              Отменить
            </Button>
            <Button 
              onClick={handlePurchaseConfirm}
              disabled={!purchaseAmount || parseFloat(purchaseAmount) <= 0 || isProcessing}
              className="bg-primary hover:bg-primary/90 neon-glow min-w-[140px]"
            >
              {isProcessing ? (
                <>
                  <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                  Обработка...
                </>
              ) : (
                <>
                  <Icon name="Check" size={18} className="mr-2" />
                  Купить
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;