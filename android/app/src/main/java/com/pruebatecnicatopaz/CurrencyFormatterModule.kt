package com.pruebatecnicatopaz

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.text.NumberFormat
import java.util.Currency
import java.util.Locale

class CurrencyFormatterModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "CurrencyFormatterModule"

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun formatCurrencySync(value: Double): String {
        val formatter = NumberFormat.getCurrencyInstance(Locale.US)
        formatter.currency = Currency.getInstance("USD")
        formatter.maximumFractionDigits = 2
        return formatter.format(value)
    }
}