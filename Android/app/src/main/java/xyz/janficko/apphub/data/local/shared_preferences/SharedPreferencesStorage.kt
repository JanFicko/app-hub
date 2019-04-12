package xyz.janficko.apphub.data.local.shared_preferences

import android.content.SharedPreferences
import com.google.gson.Gson

/**
Created by Jan Ficko on 02/04/19 for Margento.
 */

class SharedPreferencesStorage
    (private val sharedPreferences: SharedPreferences, private val gson: Gson)
    : SharedPreferencesContract {

    override fun saveString(key: String, message: String) {
        sharedPreferences.edit().putString(key, message).apply()
    }

    @Suppress("NULLABILITY_MISMATCH_BASED_ON_JAVA_ANNOTATIONS")
    override fun getString(key: String, defaultValue: String): String {
        return sharedPreferences.getString(key, defaultValue)
    }

    override fun saveLong(key: String, number: Long) {
        sharedPreferences.edit().putLong(key, number).apply()
    }

    override fun getLong(key: String, defaultValue: Long): Long {
        return sharedPreferences.getLong(key, defaultValue)
    }

    override fun saveInt(key: String, number: Int) {
        sharedPreferences.edit().putInt(key, number).apply()
    }

    override fun getInt(key: String, defaultValue: Int): Int {
        return sharedPreferences.getInt(key, defaultValue)
    }

    override fun saveFloat(key: String, number: Float) {
        sharedPreferences.edit().putFloat(key, number).apply()
    }

    override fun getFloat(key: String, defaultValue: Float): Float {
        return sharedPreferences.getFloat(key, defaultValue)
    }

    override fun saveBoolean(key: String, bool: Boolean) {
        sharedPreferences.edit().putBoolean(key, bool).apply()
    }

    override fun getBoolean(key: String, defaultValue: Boolean): Boolean {
        return sharedPreferences.getBoolean(key, defaultValue)
    }

    override fun saveObject(key: String, value: Any) {
        sharedPreferences.edit().putString(key, gson.toJson(value)).apply()
    }

    override fun <T> getObject(key: String, clazz: Class<T>): T {
        return gson.fromJson<T>(getString(key, ""), clazz)
    }

}