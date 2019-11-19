package xyz.janficko.apphub.ui.splash

import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import kotlinx.coroutines.*
import xyz.janficko.apphub.common.Constants
import xyz.janficko.apphub.ui.main.MainActivity
import xyz.janficko.apphub.util.extNavigateToActivity
import java.util.concurrent.TimeUnit
import kotlin.contracts.ExperimentalContracts
import android.content.Intent
import android.net.Uri
import androidx.appcompat.app.AlertDialog
import xyz.janficko.apphub.R

@ExperimentalContracts
class SplashActivity : AppCompatActivity() {

    private val WRITE_EXTERNAL_STORAGE_PERMISSION = 100

    override fun onResume() {
        super.onResume()

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && !packageManager.canRequestPackageInstalls()) {
            val builder = AlertDialog.Builder(this)
                .setTitle(R.string.install_permission)
                .setMessage(R.string.install_permission_description)
                .setPositiveButton(R.string.open) { dialog, _ ->
                    startActivity(
                        Intent(
                            android.provider.Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                            Uri.parse("package:${applicationContext.packageName}")
                        )
                    )

                    dialog.dismiss()
                }
            builder.create().show()



        }
        else {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
                requestPermission()
            } else {
                startApp()
            }
        }
    }

    private fun startApp() {
        CoroutineScope(Dispatchers.IO).launch {
            delay(TimeUnit.SECONDS.toMillis(Constants.SPLASH_WAIT_SECONDS))
            withContext(Dispatchers.Main) {
                extNavigateToActivity<MainActivity>()
            }
        }
    }

    private fun requestPermission() {
        ActivityCompat.requestPermissions(
            this,
            arrayOf(Manifest.permission.WRITE_EXTERNAL_STORAGE),
            WRITE_EXTERNAL_STORAGE_PERMISSION
        )
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)

        when (requestCode) {
            WRITE_EXTERNAL_STORAGE_PERMISSION -> {
                if (grantResults.isEmpty() || grantResults[0] != PackageManager.PERMISSION_GRANTED) {
                    requestPermission()
                } else {
                    startApp()
                }
            }
        }
    }
}