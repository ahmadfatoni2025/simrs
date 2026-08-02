<?php

namespace App\Traits;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;

trait HasAuditTrail
{
    public static function bootHasAuditTrail()
    {
        static::created(function ($model) {
            $model->logAudit('created', null, $model->getAttributes());
        });

        static::updated(function ($model) {
            $oldValues = array_intersect_key($model->getOriginal(), $model->getChanges());
            $newValues = $model->getChanges();

            unset($oldValues['updated_at'], $newValues['updated_at']);

            if (! empty($newValues)) {
                $model->logAudit('updated', $oldValues, $newValues);
            }
        });

        static::deleted(function ($model) {
            $model->logAudit('deleted', $model->getOriginal(), null);
        });
    }

    protected function logAudit(string $event, ?array $oldValues, ?array $newValues): void
    {
        AuditLog::create([
            'user_id' => Auth::id(),
            'event' => $event,
            'auditable_type' => get_class($this),
            'auditable_id' => $this->getKey(),
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}
