#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface CurrencyFormatterModule : NSObject <RCTBridgeModule>
@end

@implementation CurrencyFormatterModule

RCT_EXPORT_MODULE();

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(formatCurrencySync:(nonnull NSNumber *)value)
{
  NSNumberFormatter *formatter = [[NSNumberFormatter alloc] init];
  formatter.locale = [NSLocale localeWithLocaleIdentifier:@"en_US"];
  formatter.numberStyle = NSNumberFormatterCurrencyStyle;
  formatter.currencyCode = @"USD";
  formatter.maximumFractionDigits = 2;

  NSString *formatted = [formatter stringFromNumber:value];
  return formatted ?: @"";
}

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end