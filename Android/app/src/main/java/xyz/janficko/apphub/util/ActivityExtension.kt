package xyz.janficko.apphub.util

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.util.DisplayMetrics
import androidx.annotation.IdRes
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import androidx.fragment.app.FragmentTransaction
import xyz.janficko.apphub.R

fun AppCompatActivity.extGetDisplayDensity(): String {
    val metrics = DisplayMetrics()
    this.windowManager.defaultDisplay.getMetrics(metrics)

    return when (metrics.densityDpi) {
        DisplayMetrics.DENSITY_LOW -> "LDPI"
        DisplayMetrics.DENSITY_MEDIUM -> "MDPI"
        DisplayMetrics.DENSITY_HIGH -> "HDPI"
        DisplayMetrics.DENSITY_XHIGH -> "XHDPI"
        DisplayMetrics.DENSITY_XXHIGH -> "XXHDPI"
        DisplayMetrics.DENSITY_XXXHIGH -> "XXHDPI"
        else -> ""
    }
}

fun AppCompatActivity.extPackageNameExists(packageName: String) : Boolean = packageManager.getLaunchIntentForPackage(packageName) != null


fun AppCompatActivity.extStartApplication(packageName : String){
    val intent : Intent? = packageManager.getLaunchIntentForPackage(packageName)
    startActivity(intent)
}

inline fun FragmentManager.extTransaction(actionBody: FragmentTransaction.() -> Unit) {
    beginTransaction().apply(actionBody).commit()
}

fun AppCompatActivity.extAddFragmentToActivity(fragment: Fragment, tag: String) {
    supportFragmentManager.extTransaction {
        add(fragment, tag)
    }
}

inline fun <reified T : Activity> Activity.extNavigateToActivity() {
    val intent = Intent(this, T::class.java)
    startActivity(intent)
}

inline fun <reified T : Activity> Fragment.extNavigateToActivity() {
    val intent = Intent(context, T::class.java)
    startActivity(intent)
}

inline fun <reified T : Activity> Fragment.extNavigateToActivityNewTask() {
    val intent = Intent(context, T::class.java)
    intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_NEW_TASK
    startActivity(intent)
}

inline fun <reified T : Activity> Activity.extNavigateToActivity(
    isClearStack: Boolean = false,
    data: Bundle? = null) {
    val intent = Intent(this, T::class.java)
    if (isClearStack) {
        intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TASK or Intent.FLAG_ACTIVITY_NEW_TASK
    }
    if (data != null) {
        intent.putExtras(data)
    }
    startActivity(intent)
}

fun AppCompatActivity.extReplaceFragment(
    fragmentClass: Fragment,
    @IdRes frameId: Int = R.id.content_container,
    data: Bundle? = null
) {
    supportFragmentManager.extTransaction {
        var fragment : Fragment?
        fragment = supportFragmentManager.findFragmentByTag(fragmentClass.tag)
        if (fragment == null) {
            fragment = fragmentClass
        }
        data.let {
            fragment.arguments = data
        }
        replace(frameId, fragment, fragment.tag)
    }
}