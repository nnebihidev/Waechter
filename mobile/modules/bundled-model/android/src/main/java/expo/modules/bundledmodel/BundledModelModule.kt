package expo.modules.bundledmodel

import android.content.res.AssetManager
import android.net.Uri
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.io.File
import java.io.FileOutputStream
import java.io.IOException

// Reads files from APK assets, including install-time Play Asset Delivery packs
// (those are merged into the app's AssetManager). Purely local I/O.
class BundledModelModule : Module() {
  private val assets: AssetManager
    get() = appContext.reactContext?.assets ?: throw CodedException("ERR_NO_CONTEXT", "React context unavailable", null)

  override fun definition() = ModuleDefinition {
    Name("BundledModel")

    Events("onCopyProgress")

    Function("hasAsset") { assetPath: String ->
      try {
        assets.open(assetPath, AssetManager.ACCESS_STREAMING).use { true }
      } catch (e: IOException) {
        false
      }
    }

    // Copies an asset to `destUri` (file://…). Writes to a .part file first so an
    // interrupted copy is never mistaken for a complete model.
    AsyncFunction("copyAsset") { assetPath: String, destUri: String ->
      val dest = File(Uri.parse(destUri).path ?: throw CodedException("ERR_BAD_URI", "Invalid destination", null))
      dest.parentFile?.mkdirs()
      val partial = File(dest.path + ".part")
      var copied = 0L
      var lastEvent = 0L
      assets.open(assetPath, AssetManager.ACCESS_STREAMING).use { input ->
        FileOutputStream(partial).use { output ->
          val buffer = ByteArray(4 * 1024 * 1024)
          while (true) {
            val read = input.read(buffer)
            if (read < 0) break
            output.write(buffer, 0, read)
            copied += read
            if (copied - lastEvent >= 32L * 1024 * 1024) {
              lastEvent = copied
              sendEvent("onCopyProgress", mapOf("bytes" to copied.toDouble()))
            }
          }
          output.fd.sync()
        }
      }
      if (dest.exists()) dest.delete()
      if (!partial.renameTo(dest)) {
        partial.delete()
        throw CodedException("ERR_RENAME", "Could not move model into place", null)
      }
      sendEvent("onCopyProgress", mapOf("bytes" to copied.toDouble()))
      copied.toDouble()
    }
  }
}
